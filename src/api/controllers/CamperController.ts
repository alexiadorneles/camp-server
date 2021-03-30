import { Request, Response } from 'express'
import _, { Dictionary } from 'lodash'
import { Op } from 'sequelize'
import { GoogleScope } from 'types/Google'
import { Statitisc } from 'types/Statistic'
import { GoogleParametersBuilder } from '../../builder/GoogleParametersBuilder'
import { INCLUDE_CAMPER } from '../../database/associations'
import {
	Cabin,
	Camper,
	CamperActivity,
	CamperActivityAttributes,
	CamperActivityCreationAttributes,
	CamperAttributes,
	CamperEdition,
	CamperEditionAttributes,
} from '../../models'
import { PaidInscription } from '../../models/PaidInscription'
import { Country } from '../../types/Places'
import { EditionService } from '../services'
import { CamperService } from '../services/CamperService'

const { GOOGLE_KEY, BASE_URL } = process.env

export class CamperController {
	constructor(private editionService: EditionService, private camperService: CamperService) {
		this.setCabin = this.setCabin.bind(this)
		this.update = this.update.bind(this)
		this.activatePaidInscription = this.activatePaidInscription.bind(this)
	}

	public statisticsByDate = async (req: Request, res: Response): Promise<void> => {
		const { date, idCamper } = req.body
		const { answeredActivitiesOnDate, corrects, percentage } = await this.camperService.statisticByCamperAndDate(
			date,
			idCamper,
		)
		res.json({
			count: answeredActivitiesOnDate.length,
			corrects: corrects.length,
			correctPercentage: percentage.toFixed(0) + '%',
		})
	}

	public statisticsByCabin = async (req: Request, res: Response): Promise<void> => {
		const { activities, thoseThatDidntAnswer } = await this.getAnsweredActivities(req.params)
		const groupedAnswers = _.groupBy(activities, 'idCamper')
		const data: Statitisc[] = Object.entries(groupedAnswers).map(([key, answers]) => {
			const corrects = answers.filter(ca => ca.blCorrect).length
			const percentage = (corrects * 100) / answers.length || 0
			const camper = (answers[0] as any)?.camper as Camper
			return {
				camper,
				corrects,
				dsCorrectPercentage: percentage.toFixed(0) + '%',
				nrCorrectPercentage: percentage,
			}
		})
		res.json({
			answered: data.sort((a, b) => b.nrCorrectPercentage - a.nrCorrectPercentage),
			notAnswered: thoseThatDidntAnswer,
		})
	}

	private async getAnsweredActivities({ idCabin, date }: Dictionary<string>) {
		const { idEdition } = await this.editionService.findCurrent()
		const idCabinNumber = Number(idCabin)
		const [year, month, day] = date.split('-').map(Number)
		const parsedDate = new Date(year, month - 1, day)
		const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 59)

		const campersOfCabin = await CamperEdition.findAll({
			where: { idCabin: idCabinNumber, idEdition },
			attributes: ['idCamper'],
		})
		const camperIDs = campersOfCabin.map(camper => camper.idCamper)
		const campers = await Camper.findAll({
			where: { idCamper: { [Op.in]: camperIDs } },
			attributes: ['idCamper', 'dsName', 'dsImageURL', 'dsEmail'],
		})

		const activities = await CamperActivity.findAll({
			where: { idCamper: { [Op.in]: camperIDs }, idEdition, updatedAt: { [Op.between]: [parsedDate, endOfDay] } },
		})

		activities.forEach(
			(activity: any) => (activity.camper = campers.find(camper => camper.idCamper === activity.idCamper)),
		)
		return {
			activities,
			thoseThatDidntAnswer: campers.filter(camper => !activities.some(a => a.idCamper! === camper.idCamper)),
		}
	}

	public async activatePaidInscription(req: Request, res: Response): Promise<void> {
		const { code } = req.body
		const inscription = await PaidInscription.findOne({ where: { dsCode: code } })
		if (!inscription) {
			res.status(400).json({ error: 'Código não encontrado' })
		}

		const { idCabin, idPaidInscription, dsEmail } = inscription
		const { idCamper } = await Camper.findOne({ where: { dsEmail } })
		await this.addCamperInCabin(idCamper, idCabin)
		await PaidInscription.update({ blActivated: true }, { where: { idPaidInscription } })
		res.status(201).json({ success: true })
	}

	public async login(_: Request, res: Response): Promise<void> {
		res.send(
			new GoogleParametersBuilder('https://accounts.google.com/o/oauth2/v2/auth')
				.withScope(GoogleScope.USER_INFO)
				.withAccessType('offline')
				.withIncludeGrantedScopes(true)
				.withResponseType('code')
				.withRedirectURL(`${BASE_URL}/google/auth`)
				.withClientId(GOOGLE_KEY)
				.build(),
		)
	}

	public async findOne(req: Request, res: Response): Promise<void> {
		const { signedInUser } = req.params
		const camper = await Camper.findByPk(signedInUser)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}
		res.json(camper)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const idCamper = Number(req.params.signedInUser)
		const requestBody = req.body as CamperAttributes
		if (requestBody.tpCountry !== Country.BRAZIL) {
			requestBody.tpState = null
		}
		const updatedCamper = await this.camperService.update(requestBody, { idCamper })
		res.json(updatedCamper)
	}

	public async setCabin(req: Request, res: Response): Promise<void> {
		const { idCabin } = req.body as Partial<CamperAttributes>
		const idCamper = Number(req.params.idCamper)
		const cabinWithCampers = await Cabin.findOne({ include: INCLUDE_CAMPER, where: { idCabin } })
		const { nrCabinLimit } = await this.editionService.findCurrent()
		if ((cabinWithCampers as any).campers!.length >= nrCabinLimit) {
			res.status(400).json({ error: `O chalé está ${idCabin} lotado. Por favor escolha outro` })
			return
		}
		const camperEdition = await this.addCamperInCabin(idCamper, idCabin)
		res.json(camperEdition)
	}

	private async addCamperInCabin(idCamper: number, idCabin: number): Promise<CamperEdition> {
		await Camper.update({ idCabin }, { where: { idCamper } })
		const [camperEdition] = await this.createCamperEdition(idCabin, idCamper)
		return camperEdition
	}

	private async createCamperEdition(idCabin: number, idCamper: number): Promise<[CamperEdition, boolean]> {
		const { idEdition } = await this.editionService.findCurrent()
		const where: Partial<CamperEditionAttributes> = { idCabin, idCamper, idEdition }
		return CamperEdition.findOrCreate({ where })
	}

	public async answerActivity(req: Request, res: Response): Promise<void> {
		const activityInfo = req.body as CamperActivityCreationAttributes
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}

		const created = await camper.createCamperActivity(activityInfo)
		res.json(created)
	}

	public async answerTimedOut(req: Request, res: Response): Promise<void> {
		const { idActivity, idEdition, idRound } = req.body
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}

		const camperActivity: Partial<CamperActivityAttributes> = {
			blCorrect: false,
			// idRound,
			idActivity,
			idCamper: Number(idCamper),
			idActivityOption: null,
			idEdition,
		}

		const created = await camper.createCamperActivity(camperActivity)
		res.json(created)
	}
}

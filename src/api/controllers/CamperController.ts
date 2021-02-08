import { Request, Response } from 'express'
import _ from 'lodash'
import { Op } from 'sequelize'
import {
	Camper,
	CamperActivity,
	CamperActivityAttributes,
	CamperActivityCreationAttributes,
	CamperAttributes,
	CamperEdition,
	CamperEditionAttributes,
	Cabin,
} from '../../models'
import { PaidInscription } from '../../models/PaidInscription'
import { Country } from '../../types/Places'
import { JWTMediator } from '../routes/middlewares/JWTMediator'
import { EditionService } from '../services'
import { CamperService } from '../services/CamperService'
import { INCLUDE_CAMPER } from '../../database/associations'
const { PRIORITY_EMAILS_1, PRIORITY_EMAILS_2, PRIORITY_EMAILS_3, PRIORITY_EMAILS_4 } = process.env

export class CamperController {
	private priorityEmails: string[]

	constructor(private editionService: EditionService, private camperService: CamperService) {
		const emailsStrings = [PRIORITY_EMAILS_1, PRIORITY_EMAILS_2, PRIORITY_EMAILS_3, PRIORITY_EMAILS_4]
		const emails = emailsStrings.map(string => JSON.parse(string))
		this.priorityEmails = _.flatten(emails).map((email: string) => email.trim().toLowerCase())
		this.create = this.create.bind(this)
		this.loginOrRegister = this.loginOrRegister.bind(this)
		this.setCabin = this.setCabin.bind(this)
		this.update = this.update.bind(this)
		this.activatePaidInscription = this.activatePaidInscription.bind(this)
		this.validatePriorityInscription = this.validatePriorityInscription.bind(this)
	}

	public async validatePriorityInscription(req: Request, res: Response): Promise<void> {
		const { signedInUser } = req.params
		const { dsEmail } = await Camper.findOne({ where: { idCamper: Number(signedInUser) } })
		res.json(this.priorityEmails.includes(dsEmail))
	}

	public async statisticsByDate(req: Request, res: Response): Promise<void> {
		const { date, idCamper } = req.body
		const [year, month, day] = date.split('-')
		const parsedDate = new Date(year, Number(month) - 1, day)
		const endOfDay = new Date(year, Number(month) - 1, day, 23, 59, 59, 59)
		const answeredActivitiesOnDate = await CamperActivity.findAll({
			where: { idCamper, updatedAt: { [Op.between]: [parsedDate, endOfDay] } },
		})
		const corrects = answeredActivitiesOnDate.filter(ca => ca.blCorrect)
		const percentage = (corrects.length * 100) / answeredActivitiesOnDate.length || 0
		res.json({
			count: answeredActivitiesOnDate.length,
			corrects: corrects.length,
			correctPercentage: percentage.toFixed(0) + '%',
		})
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

	public async loginOrRegister(req: Request, res: Response): Promise<void> {
		const { idGoogle } = req.body
		const camper = await Camper.findOne({ where: { idGoogle } })

		if (!camper) {
			this.create(req, res)
			return
		}

		const token = JWTMediator.sign({ idCamper: Number(camper.idCamper), password: '' })
		res.json({ camper, token })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const camperAttributes = req.body
		try {
			const camper = await Camper.create(camperAttributes)
			const token = JWTMediator.sign({ idCamper: camper.idCamper, password: '' })
			res.json({ camper, token })
		} catch (error) {
			res.status(400).json({ error })
		}
	}

	public async login(req: Request, res: Response): Promise<void> {
		const [hashType, hash] = req.headers.authorization.split(' ')
		const { idCamper } = JWTMediator.decode(hash)
		try {
			const camper = await Camper.findByPk(idCamper)
			if (!camper) {
				res.status(401).json({ error: 'User not found' })
				return
			}

			const token = JWTMediator.sign({ idCamper: Number(idCamper), password: '' })
			res.json({ camper, token })
		} catch (error) {
			res.status(401).json({ error })
		}
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

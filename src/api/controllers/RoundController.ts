import { Request, Response } from 'express'
import _ from 'lodash'
import { Includeable, Op } from 'sequelize'
import { Activity, ActivityOption, CamperActivity, CamperEdition, Round } from '../../models'
import { RoundConfig } from '../../types/RoundConfig'
import { EditionService } from '../services'
import { ActivityService } from '../services/ActivityService'

export class RoundController {
	constructor(private editionService: EditionService, private activityService: ActivityService) {
		this.generateRoundFromConfig = this.generateRoundFromConfig.bind(this)
		this.loadRoundForCamper = this.loadRoundForCamper.bind(this)
	}

	public generateRandomByNumber = async (req: Request, res: Response) => {
		const { quantity } = req.params
		const { idEdition } = await this.editionService.findCurrent()
		const idsCampers = await this.getIdFromAllCampersInCurrentEdition(idEdition)

		const rounds: Round[] = []

		for (const idCamper of idsCampers) {
			const activities = await this.activityService.findRandomUnanswered(idCamper, Number(quantity))
			const createdRound = await this.createRound(idCamper, idEdition, activities)
			rounds.push(createdRound)
		}

		res.json(rounds)
	}

	private async getIdFromAllCampersInCurrentEdition(idEdition: number) {
		const allCampersFromThisEdition = await CamperEdition.findAll({
			where: { idEdition },
			attributes: ['idCamper'],
		})
		const idsCampers = allCampersFromThisEdition.map(ce => ce.idCamper)
		return idsCampers
	}

	public async generateRoundFromConfig(req: Request, res: Response): Promise<void> {
		const config = req.body as RoundConfig
		const { idEdition } = await this.editionService.findCurrent()
		const allCampersFromThisEdition = await CamperEdition.findAll({
			where: { idEdition },
			attributes: ['idCamper'],
		})

		const idsCampers = allCampersFromThisEdition.map(ce => ce.idCamper)
		const rounds: Round[] = []

		for (const idCamper of idsCampers) {
			const activitiesPromises = await Promise.all<Activity[]>(
				config.activitiesConfig.map(activityConfig => this.activityService.findRandomWhere(activityConfig, idCamper)),
			)
			const activities = _.flatMap(activitiesPromises)
			const createdRound = await this.createRound(idCamper, idEdition, activities)
			rounds.push(createdRound)
		}

		res.json(rounds)
	}

	public async loadRoundForCamper(req: Request, res: Response): Promise<void> {
		const { idCamper } = req.params
		const round = await Round.findOne({
			where: {
				idCamper,
				blFinished: false,
			},
			include: [
				{
					model: Activity,
					as: 'activities',
					foreignKey: 'idActivity',
					include: [
						{
							model: ActivityOption,
							as: 'options',
						} as Includeable,
					],
				} as Includeable,
			],
		})
		const { idEdition } = await this.editionService.findCurrent()
		const activitiesIds = round.activities.map(activity => activity.idActivity)
		const answers = await CamperActivity.findAll({
			where: { idCamper, idEdition, idActivity: { [Op.in]: activitiesIds } },
		})
		const answeredActivities = answers.map(answer => answer.idActivity)
		const newActivities = round.activities.filter(activity => !answeredActivities.includes(activity.idActivity))
		delete round.dataValues.activities
		res.json({ activities: newActivities, ...round.dataValues })
	}

	public async finish(req: Request, res: Response): Promise<void> {
		const { idRound, signedInUser } = req.params
		if (!idRound) {
			const openRound = await Round.findOne({ where: { idCamper: signedInUser, blFinished: false } })
			const [rows, data] = await Round.update(
				{ blFinished: true, dtEnd: new Date() },
				{ where: { idRound: openRound.idRound } },
			)
			res.json(data ? data : rows)
			return
		}

		const [rows, data] = await Round.update({ blFinished: true, dtEnd: new Date() }, { where: { idRound } })
		res.json(data ? data : rows)
	}

	private async createRound(idCamper: number, idEdition: number, activities: Activity[]) {
		const round = await Round.create({
			idCamper,
			idEdition,
			blFinished: false,
			dtBegin: new Date(),
			dtEnd: null,
		})
		await Promise.all(activities.map(activity => round.addActivity(activity)))
		return Round.findByPk(round.idRound, {
			include: [
				{
					model: Activity,
					foreignKey: 'idActivity',
					as: 'activities',
					attributes: ['idActivity', 'dsQuestion', 'tpActivity', 'tpLevel'],
				} as Includeable,
			],
		})
	}
}

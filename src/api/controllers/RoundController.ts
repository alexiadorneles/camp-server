import { Request, Response } from 'express'
import _ from 'lodash'
import { Includeable } from 'sequelize'
import { Camper, CamperEdition, Round, Activity, ActivityOption } from '../../models'
import { RoundConfig } from '../../types/RoundConfig'
import { EditionService } from '../services'
import { ActivityService } from '../services/ActivityService'

export class RoundController {
	constructor(private editionService: EditionService, private activityService: ActivityService) {
		this.generateRoundFromConfig = this.generateRoundFromConfig.bind(this)
	}

	public async generateRoundFromConfig(req: Request, res: Response): Promise<void> {
		const config = req.body as RoundConfig
		const { idEdition } = await this.editionService.findCurrent()
		const allCampersFromThisEdition = await CamperEdition.findAll({
			where: { idEdition },
			include: { model: Camper, as: 'camper' } as Includeable,
		})

		const idsCampers = allCampersFromThisEdition.map(ce => ce.idCamper)
		const rounds: Round[] = []

		for (const idCamper of idsCampers) {
			const activitiesPromises = await Promise.all(
				config.activitiesConfig.map(activityConfig => this.activityService.findRandomWhere(activityConfig, idCamper)),
			)
			const activities = _.flatMap(activitiesPromises)
			const round = await Round.create({
				idCamper,
				idEdition,
				blFinished: false,
				dtBegin: new Date(),
				dtEnd: null,
			})

			await Promise.all(activities.map(activity => round.addActivity(activity)))
			const createdRound = await Round.findByPk(round.idRound, {
				include: [
					{
						model: Activity,
						foreignKey: 'idActivity',
						as: 'activities',
						attributes: ['idActivity', 'dsQuestion', 'tpActivity', 'tpLevel'],
					} as Includeable,
				],
			})

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

		res.json(round)
	}

	public async finish(req: Request, res: Response): Promise<void> {
		const { idRound } = req.params
		const [rows, data] = await Round.update({ blFinished: true, dtEnd: new Date() }, { where: { idRound } })
		res.json(data ? data : rows)
	}
}

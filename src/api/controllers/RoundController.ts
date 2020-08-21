import { Request, Response } from 'express'
import _ from 'lodash'
import { Round } from '../../models'
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
		const activitiesPromises = await Promise.all(
			config.activitiesConfig.map(activityConfig => this.activityService.findRandomWhere(activityConfig)),
		)
		const activities = _.flatMap(activitiesPromises)
		const round = await Round.create({
			blFinished: false,
			dtBegin: new Date(),
			dtEnd: null,
			idEdition,
		})

		await Promise.all(activities.map(activity => round.addActivity(activity)))

		const completeRound = await Round.findByPk(round.idRound, {
			// include: [{ model: Activity, as: 'activities', include: ActivityOption } as Includeable],
			include: { all: true, nested: true },
		})

		res.json(completeRound)
	}
}

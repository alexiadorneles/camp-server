import { Request, Response } from 'express'
import { Includeable, Op, WhereOptions } from 'sequelize'
import { Activity, Cabin, Camper, CamperActivity } from '../../models'
import { ActivityEdition, ActivityEditionAttributes } from '../../models/ActivityEditionModel'
import { Ranking } from '../../models/RankingModel'
import { EditionService } from '../services'

export class RankingController {
	constructor(private editionService: EditionService) {
		this.generateRanking = this.generateRanking.bind(this)
	}
	public async generateRanking(req: Request, res: Response): Promise<void> {
		const cabins = await Cabin.findAll()
		const { idEdition } = await this.editionService.findCurrent()

		const toBeReturned: Ranking[] = []

		// 	FOREACH CABIN
		for (const cabin of cabins) {
			// 	Pegar last ranking
			const lastRanking = await Ranking.findOne({
				where: { idEdition, idCabin: cabin.idCabin },
				order: [['createdAt', 'DESC']],
			})

			// Pegar campers desse cabin
			const campersOfThisCabin = await Camper.findAll({ where: { idCabin: cabin.idCabin }, attributes: ['idCamper'] })

			// Pegar todos os Camper Activities com createdAt AFTER last ranking
			const where: WhereOptions<ActivityEditionAttributes> = {
				idEdition,
				idCamper: {
					[Op.in]: campersOfThisCabin.map(camper => camper.idCamper),
				},
				blCorrect: true,
			}

			if (lastRanking) {
				where.createdAt = {
					[Op.gt]: lastRanking.createdAt,
				}
			}

			const result: { idActivity: number; count: number }[] = await CamperActivity.count({
				where,
				group: ['idActivity'],
				attributes: ['idActivity'],
			})

			const activities = result.map(r => r.idActivity)
			const loadedActivities = await Activity.findAll({
				where: { idActivity: { [Op.in]: activities } },
				attributes: ['idActivity', 'tpActivity'],
			})

			// 	Pegar os pontos da Activity pela edition no ActivityEdition
			const activityEdition = await ActivityEdition.findAll({
				where: {
					idEdition,
				},
			})

			const nrPoints = result.reduce((acc, { idActivity, count }) => {
				const tpActivity = loadedActivities.find(l => l.idActivity === idActivity)!.tpActivity
				const points = activityEdition.find(ae => ae.tpActivity === tpActivity)!.nrPoints
				return acc + count * points
			}, 0)

			const rankItem = await Ranking.create({
				idEdition,
				idCabin: cabin.idCabin,
				nrPoints: lastRanking ? lastRanking.nrPoints + nrPoints : nrPoints,
			})

			toBeReturned.push(rankItem)
		}

		res.json(toBeReturned.sort((a, b) => b.nrPoints - a.nrPoints))
	}
}

/*
	FOREACH CABIN
	Pegar last ranking
  Pegar todos os Camper Activities com createdAt AFTER last ranking
  Pegar as Acitvities dos CamperActivites
	Pegar os pontos da Activity pela edition no ActivityEdition
	Multiplicar os pontos pelo count dos CamperActivities corretos
*/

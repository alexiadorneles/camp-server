import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import { Activity, Cabin, Camper, CamperActivity, Round } from '../../models'
import { ActivityEdition, ActivityEditionAttributes } from '../../models/ActivityEditionModel'
import { Ranking } from '../../models/RankingModel'
import { EditionService } from '../services'

interface CountResult {
	idActivity: number
	count: number
}

export class RankingController {
	constructor(private editionService: EditionService) {
		this.generateRanking = this.generateRanking.bind(this)
	}
	public async generateRanking(req: Request, res: Response): Promise<void> {
		await this.endAllRounds()
		const cabins = await Cabin.findAll()
		const { idEdition } = await this.editionService.findCurrent()
		const activityEdition = await ActivityEdition.findAll({ where: { idEdition } })
		const toBeReturned: Ranking[] = []

		for (const { idCabin } of cabins) {
			const lastRanking = await this.loadLastRankingData(idEdition, idCabin)
			const campersOfThisCabin = await Camper.findAll({ where: { idCabin }, attributes: ['idCamper'] })
			const correctAnswers = await this.countUserCorrectAnswers(idEdition, campersOfThisCabin, lastRanking)
			const loadedActivities = await this.loadActivities(correctAnswers)
			const nrPoints = correctAnswers.reduce(this.countPoints(loadedActivities, activityEdition), 0)
			const rankItem = await this.persistRankingForCabin(idEdition, idCabin, lastRanking, nrPoints)
			toBeReturned.push(rankItem)
		}

		res.json(toBeReturned.sort((a, b) => b.nrPoints - a.nrPoints))
	}

	private async endAllRounds() {
		return Round.update({ blFinished: true }, { where: { blFinished: false } })
	}

	private persistRankingForCabin(
		idEdition: number,
		idCabin: number,
		lastRanking: Ranking,
		nrPoints: number,
	): Promise<Ranking> {
		return Ranking.create({
			idEdition,
			idCabin,
			nrPoints: lastRanking ? lastRanking.nrPoints + nrPoints : nrPoints,
		})
	}

	private countPoints(
		loadedActivities: Activity[],
		activityEdition: ActivityEdition[],
	): (previousValue: number, currentValue: CountResult, currentIndex: number, array: CountResult[]) => number {
		return (acc, { idActivity, count }) => {
			const tpActivity = loadedActivities.find(l => l.idActivity === idActivity)!.tpActivity
			const points = activityEdition.find(ae => ae.tpActivity === tpActivity)!.nrPoints
			return acc + count * points
		}
	}

	private loadActivities(correctAnswers: CountResult[]): Promise<Activity[]> {
		return Activity.findAll({
			where: { idActivity: { [Op.in]: correctAnswers.map(r => r.idActivity) } },
			attributes: ['idActivity', 'tpActivity'],
		})
	}

	private loadLastRankingData(idEdition: number, idCabin: number): Promise<Ranking | null> {
		return Ranking.findOne({
			where: { idEdition, idCabin },
			order: [['createdAt', 'DESC']],
		})
	}

	private countUserCorrectAnswers(
		idEdition: number,
		campers: Camper[],
		lastRanking: Ranking | null,
	): Promise<CountResult[]> {
		const where: WhereOptions<ActivityEditionAttributes> = {
			idEdition,
			idCamper: {
				[Op.in]: campers.map(camper => camper.idCamper),
			},
			blCorrect: true,
		}

		if (lastRanking) {
			where.createdAt = {
				[Op.gt]: lastRanking.createdAt,
			}
		}

		return CamperActivity.count({
			where,
			group: ['idActivity'],
			attributes: ['idActivity'],
		}) as any
	}
}

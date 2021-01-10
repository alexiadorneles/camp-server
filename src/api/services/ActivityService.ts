import { Op, Sequelize } from 'sequelize'
import { Activity, CamperActivity } from '../../models'
import { ActivityConfig } from '../../types/RoundConfig'

export class ActivityService {
	public async findRandomUnanswered(idCamper: number, quantity: number): Promise<Activity[]> {
		const campersActivities = await CamperActivity.findAll({ where: { idCamper } })
		const activitiesIds = campersActivities.map(ca => ca.idActivity)
		const activities = await Activity.findAll({
			where: { idActivity: { [Op.notIn]: activitiesIds } },
			limit: quantity,
			order: Sequelize.literal('rand()'),
		})

		if (activities.length < quantity) {
			return this.loadMissingOnesFromOldestAnswers(activities, activitiesIds, quantity)
		}

		return activities
	}

	public async findRandomWhere({ nrQuantity, tpLevel, type }: ActivityConfig, idCamper: number): Promise<Activity[]> {
		const campersActivities = await CamperActivity.findAll({ where: { idCamper } })
		const activitiesIds = campersActivities.map(ca => ca.idActivity)
		const activities = await Activity.findAll({
			where: {
				tpActivity: type,
				tpLevel,
				idActivity: { [Op.notIn]: activitiesIds },
			},
			limit: nrQuantity,
		})

		if (activities.length < nrQuantity) {
			return this.loadMissingOnesFromOldestAnswersFromConfig({ nrQuantity, tpLevel, type }, activities, activitiesIds)
		}

		return activities
	}

	private async loadMissingOnesFromOldestAnswers(
		activities: Activity[],
		activitiesIds: number[],
		quantity: number,
	): Promise<Activity[]> {
		const numberOfMissing = quantity - activities.length
		const activitiesOldestAnswer = await CamperActivity.findAll({
			where: { idActivity: { [Op.in]: activitiesIds } },
			order: [['updatedAt', 'ASC']],
			attributes: ['idActivity'],
		})

		const missing = await Activity.findAll({
			where: { idActivity: { [Op.in]: activitiesOldestAnswer.map(a => a.idActivity) } },
			limit: numberOfMissing,
			order: Sequelize.literal('rand()'),
		})

		return [...activities, ...missing]
	}

	private async loadMissingOnesFromOldestAnswersFromConfig(
		{ nrQuantity, tpLevel, type }: ActivityConfig,
		activities: Activity[],
		activitiesIds: number[],
	): Promise<Activity[]> {
		const numberOfMissing = nrQuantity - activities.length
		const activitiesOldestAnswer = await CamperActivity.findAll({
			where: { idActivity: { [Op.in]: activitiesIds } },
			order: [['updatedAt', 'ASC']],
			attributes: ['idActivity'],
		})
		const missing = await Activity.findAll({
			where: {
				tpActivity: type,
				tpLevel,
				idActivity: { [Op.in]: activitiesOldestAnswer.map(a => a.idActivity) },
			},
			limit: numberOfMissing,
		})

		return [...activities, ...missing]
	}
}

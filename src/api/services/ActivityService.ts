import { Op } from 'sequelize'
import { Activity, CamperActivity } from '../../models'
import { ActivityConfig } from '../../types/RoundConfig'

export class ActivityService {
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
			return this.loadMissingOnesFromOldestAnswers({ nrQuantity, tpLevel, type }, activities, activitiesIds)
		}

		return activities
	}

	private async loadMissingOnesFromOldestAnswers(
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

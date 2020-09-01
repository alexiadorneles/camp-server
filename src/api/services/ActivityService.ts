import { Op } from 'sequelize'
import { Activity, CamperActivity } from '../../models'
import { ActivityConfig } from '../../types/RoundConfig'

export class ActivityService {
	public async findRandomWhere(config: ActivityConfig, idCamper: number): Promise<Activity[]> {
		const campersActivities = await CamperActivity.findAll({ where: { idCamper } })
		const activitiesIds = campersActivities.map(ca => ca.idActivity)
		const { nrQuantity, tpLevel, type } = config
		return Activity.findAll({
			where: {
				tpActivity: type,
				tpLevel: tpLevel,
				idActivity: { [Op.notIn]: activitiesIds },
			},
			limit: nrQuantity,
		})
	}
}

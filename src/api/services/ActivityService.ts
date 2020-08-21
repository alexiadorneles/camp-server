import { ActivityConfig } from '../../types/RoundConfig'
import { Activity } from '../../models'

export class ActivityService {
	public findRandomWhere(config: ActivityConfig): Promise<Activity[]> {
		const { nrQuantity, tpLevel, type } = config
		return Activity.findAll({
			where: {
				tpActivity: type,
				tpLevel: tpLevel,
			},
			limit: nrQuantity,
		})
	}
}

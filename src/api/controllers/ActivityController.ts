import { Request, Response } from 'express'
import { ActivityBuilder } from '../../builder/ActivityBuilder'
import { IndexedObject } from '../../database/associations'
import { Activity } from '../../models/ActivityModel'
import { FileUtils } from '../../util/FileUtils'

export class ActivityController {
	public async generateFromCSV(req: Request, res: Response): Promise<void> {
		const csv = await FileUtils.readActivitiesCSV()
		const activitiesPlusOptions = ActivityBuilder.buildActivitiesFromCSV(csv)
		for (const { activity, options } of activitiesPlusOptions) {
			const [instance, created] = await Activity.findOrCreate({
				where: {
					dsQuestion: activity.dsQuestion,
				},
				defaults: activity,
			})

			if (created) {
				for (const option of options) {
					await instance.createOption(option as IndexedObject)
				}
			}
		}
		res.json(true)
	}
}

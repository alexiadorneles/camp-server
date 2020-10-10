import { Request, Response } from 'express'
import { ActivityBuilder } from '../../builder/ActivityBuilder'
import { IndexedObject } from '../../database/associations'
import { ActivityEdition, CamperActivity, CamperActivityCreationAttributes } from '../../models'
import { Activity } from '../../models/ActivityModel'
import { ActivityConfig, ActivityType } from '../../types/Activity'
import { FileUtils } from '../../util/FileUtils'
import { EditionService } from '../services'

export class ActivityController {
	constructor(private editionService: EditionService) {
		this.generateFromCSV = this.generateFromCSV.bind(this)
		this.configureForCurrentEdition = this.configureForCurrentEdition.bind(this)
		this.endCurrentActivity = this.endCurrentActivity.bind(this)
	}
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

	public async configureForCurrentEdition(req: Request, res: Response): Promise<void> {
		const config = req.body as ActivityConfig[]

		if (Object.values(ActivityType).some(v => !config.map(c => c.tpActivity).includes(v))) {
			const missing = Object.values(ActivityType).filter(v => !config.map(c => c.tpActivity).includes(v))
			res.status(404).json({ error: 'Missing configuration for following types: ' + missing.join(',') })
			return
		}

		const { idEdition } = await this.editionService.findCurrent()
		const records = await ActivityEdition.bulkCreate(config.map(ac => ({ ...ac, idEdition })))
		res.json(records)
	}

	public async endCurrentActivity(req: Request, res: Response): Promise<void> {
		const { idEdition } = await this.editionService.findCurrent()
		const idCamper = Number(req.params.signedInUser)
		const idActivity = Number(req.params.idActivity)
		const camperActivity: CamperActivityCreationAttributes = {
			idCamper,
			idActivity,
			idEdition,
			idActivityOption: null,
			blCorrect: false,
		}
		const result = CamperActivity.create(camperActivity)
		res.json(result)
	}
}

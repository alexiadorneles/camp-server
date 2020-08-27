import { Request, Response } from 'express'
import {
	Camper,
	CamperActivityAttributes,
	CamperActivityCreationAttributes,
	CamperAttributes,
	CamperCreationAttributes,
} from '../../models'
import { Country } from '../../types/Places'
import { JWTMediator } from '../routes/JWTMediator'

export class CamperController {
	public async create(req: Request, res: Response): Promise<void> {
		const camper = req.body
		try {
			const created = await Camper.create(camper)
			const token = JWTMediator.sign({ idCamper: created.idCamper, password: '' })
			res.json({ created, token })
		} catch (error) {
			res.status(400).json({ error })
		}
	}

	public async findOne(req: Request, res: Response): Promise<void> {
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}
		res.json(camper)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const requestBody = req.body as CamperCreationAttributes
		if (requestBody.tpCountry !== Country.BRAZIL) {
			requestBody.tpState = null
		}

		const [rows, data] = await Camper.update(requestBody, {
			where: {
				idCamper: requestBody.idCamper,
			},
		})

		res.json(data ? data[0] : rows)
	}

	public async setCabin(req: Request, res: Response): Promise<void> {
		const { idCabin } = req.body as Partial<CamperAttributes>
		const { idCamper } = req.params
		const [rows, data] = await Camper.update({ idCabin }, { where: { idCamper } })
		res.json(data ? data[0] : rows)
	}

	public async answerActivity(req: Request, res: Response): Promise<void> {
		const activityInfo = req.body as CamperActivityCreationAttributes
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}

		const created = await camper.createCamperActivity(activityInfo)
		res.json(created)
	}

	public async answerTimedOut(req: Request, res: Response): Promise<void> {
		const { idActivity, idEdition } = req.body
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}

		const camperActivity: Partial<CamperActivityAttributes> = {
			blCorrect: false,
			idActivity,
			idCamper: Number(idCamper),
			idActivityOption: null,
			idEdition,
		}

		const created = await camper.createCamperActivity(camperActivity)
		res.json(created)
	}
}

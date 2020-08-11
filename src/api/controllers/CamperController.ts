import { Request, Response } from 'express'
import { Camper, CamperCreationAttributes } from '../../models'
import { Country } from '../../types/Places'

export class CamperController {
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
}

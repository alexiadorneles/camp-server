import { Request, Response } from 'express'
import { Camper } from '../../models'

export class CamperController {
	public async findOne(req: Request, res: Response): Promise<void> {
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}
		res.json(camper)
	}
}

import { Request, Response } from 'express'
import { INCLUDE_CAMPER } from '../../database/associations'
import { Cabin } from '../../models/CabinModel'

export class CabinController {
	public async findAll(req: Request, res: Response): Promise<any> {
		const allCabins = await Cabin.findAll()
		return res.json(allCabins)
	}

	public async findAllIncludingCampers(req: Request, res: Response): Promise<any> {
		const allCabins = await Cabin.findAll({
			include: INCLUDE_CAMPER,
		})

		return res.json(allCabins)
	}
}

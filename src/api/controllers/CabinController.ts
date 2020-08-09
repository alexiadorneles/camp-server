import { Cabin } from '../../models/CabinModel'
import { Response, Request } from 'express'

export class CabinController {
	public async findAll(req: Request, res: Response): Promise<any> {
		const allCabins = await Cabin.findAll()
		return res.json(allCabins)
	}
}

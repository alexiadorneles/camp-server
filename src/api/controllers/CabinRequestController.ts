import { Request, Response } from 'express'
import { CabinRequestAttributes, CabinRequest } from '../../models'

export class CabinRequestController {
	public async create(req: Request, res: Response<CabinRequestAttributes>): Promise<void> {
		const body = req.body as CabinRequestAttributes
		const created = await CabinRequest.create(body)
		res.json(created)
	}
}

import { Request, Response } from 'express'
import { Edition } from '../../models'

export class EditionController {
	public async findCurrent(req: Request, res: Response): Promise<any> {
		const edition = await Edition.findOne({
			where: {
				dtEnd: null,
			},
		})

		if (!edition) {
			return res.status(400).json({ error: 'No current edition' })
		}

		res.json(edition)
	}
}

import { Request, Response } from 'express'
import { CabinRequestAttributes, CabinRequest, Status } from '../../models'
import { EditionService } from '../services/EditionService'

export class CabinRequestController {
	constructor(private editionService: EditionService) {
		this.create = this.create.bind(this)
		this.camperHasRequestedCabin = this.camperHasRequestedCabin.bind(this)
	}

	public async create(req: Request, res: Response<CabinRequestAttributes>): Promise<void> {
		const body = req.body as CabinRequestAttributes
		const created = await CabinRequest.create(body)
		res.json(created)
	}

	public async camperHasRequestedCabin(req: Request, res: Response): Promise<void> {
		const { idCamper } = req.params
		const currentEdition = await this.editionService.findCurrent()
		const number = await CabinRequest.count({
			where: {
				idCamper,
				idEdition: currentEdition.idEdition,
				status: Status.UNRESOLVED,
			},
		})

		res.json(Boolean(number))
	}
}

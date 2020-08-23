import { Request, Response } from 'express'
import { CabinRequestAttributes, CabinRequest, Status, Cabin } from '../../models'
import { EditionService } from '../services/EditionService'
import { Includeable } from 'sequelize/types'
import { IndexedObject } from '../../types/Data'
import { Divinity } from '../../types/Mythology'

export class CabinRequestController {
	constructor(private editionService: EditionService) {
		this.create = this.create.bind(this)
		this.camperHasRequestedCabin = this.camperHasRequestedCabin.bind(this)
		this.countCabinRequests = this.countCabinRequests.bind(this)
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

	public async countCabinRequests(req: Request, res: Response): Promise<void> {
		const firstOptions = ((await CabinRequest.count({
			group: ['idFirstOptionCabin'],
		})) as any) as IndexedObject[]
		const secondOptions = ((await CabinRequest.count({
			group: ['idSecondOptionCabin'],
		})) as any) as IndexedObject[]
		const thirdOptions = ((await CabinRequest.count({
			group: ['idThirdOptionCabin'],
		})) as any) as IndexedObject[]

		res.json({
			firstOptions: this.replaceIdForName('idFirstOptionCabin', firstOptions),
			secondOptions: this.replaceIdForName('idSecondOptionCabin', secondOptions),
			thirdOptions: this.replaceIdForName('idThirdOptionCabin', thirdOptions),
		})
	}

	private replaceIdForName(idProp: string, options: IndexedObject[]): IndexedObject[] {
		const divinities = Object.values(Divinity)
		return options
			.map(option => ({ dsCabin: divinities[option[idProp]], count: option.count }))
			.sort((a, b) => b.count - a.count)
	}
}

import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import _ from 'lodash'
import { Includeable } from 'sequelize/types'
import { Cabin, CabinRequest, Camper, CamperEdition, CamperEditionAttributes, Status } from '../../models'
import { Admin } from '../../models/AdminModel'
import { JWTMediator } from '../routes/JWTMediator'
import { EditionService } from '../services'

export class AdminController {
	constructor(private editionService: EditionService) {
		this.listCabinRequests = this.listCabinRequests.bind(this)
	}

	public async login(req: Request, res: Response): Promise<void> {
		const [hashType, hash] = req.headers.authorization.split(' ')
		const [idGoogle, password] = new Buffer(hash, 'base64').toString().split(':')

		const admin = await Admin.findOne({ where: { idGoogle } })

		if (!admin) {
			res.status(403).json({ error: 'Forbidden' })
			return
		}

		const isPasswordCorrect = await bcrypt.compare(password, admin.password)
		if (!isPasswordCorrect) {
			res.status(403).json({ error: 'Incorrect Password' })
			return
		}

		const token = JWTMediator.sign({ idGoogleAdmin: idGoogle, password: null, idCamper: null })
		res.json({ token })
	}

	public async listCabinRequests(req: Request, res: Response): Promise<void> {
		const { idEdition } = await this.editionService.findCurrent()
		const cabins = await Cabin.findAll()
		const requests = await CabinRequest.findAll({
			where: {
				idEdition,
				status: Status.UNRESOLVED,
			},
			include: { model: Camper, as: 'camper' } as Includeable,
		})
		const cabinRequests = requests.map(req => this.populateCabin(req, cabins))
		const groupedRequests = _.groupBy(cabinRequests, 'idFirstOptionCabin')
		res.json(groupedRequests)
	}

	public async setCamperInCabin(req: Request, res: Response): Promise<void> {
		const { request, idCabin } = req.body
		const idEdition = request.idEdition
		const idCamper = request.idCamper
		const idCabinRequest = request.idCabinRequest
		const camperEdition: Partial<CamperEditionAttributes> = {
			idCabin,
			idEdition,
			idCamper,
		}
		await CamperEdition.create(camperEdition)
		await CabinRequest.update({ status: Status.RESOLVED }, { where: { idCabinRequest } })
		await Camper.update({ idCabin }, { where: { idCamper } })
		res.json(true)
	}

	private populateCabin(req: CabinRequest, cabins: Cabin[]): CabinRequest {
		return {
			...req.get(),
			firstOptionCabin: cabins.find(cabin => cabin.idCabin === req.idFirstOptionCabin)!,
			secondOptionCabin: cabins.find(cabin => cabin.idCabin === req.idSecondOptionCabin)!,
			thirdOptionCabin: cabins.find(cabin => cabin.idCabin === req.idThirdOptionCabin)!,
		} as CabinRequest
	}
}

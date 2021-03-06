import bcrypt from 'bcryptjs'
import CryptoJS from 'crypto-js'
import { Request, Response } from 'express'
import _ from 'lodash'
import { Includeable, Op } from 'sequelize'
import { Cabin, CabinRequest, Camper, CamperEdition, CamperEditionAttributes, Edition, Status } from '../../models'
import { Admin } from '../../models/AdminModel'
import { Mission, MissionAttributes } from '../../models/MissionModel'
import { PaidInscription, PaidInscriptionAttributes } from '../../models/PaidInscription'
import { FileUtils } from '../../util/FileUtils'
import { JWTMediator } from '../routes/middlewares/JWTMediator'
import { EditionService } from '../services'
import { CamperService } from '../services/CamperService'

const { ENCRYPTION_KEY } = process.env

export class AdminController {
	constructor(private editionService: EditionService, private camperService: CamperService) {
		this.listCabinRequests = this.listCabinRequests.bind(this)
		this.endEdition = this.endEdition.bind(this)
		this.initEdition = this.initEdition.bind(this)
		this.updateEditionWithParticipants = this.updateEditionWithParticipants.bind(this)
		this.createPaidInscription = this.createPaidInscription.bind(this)
	}

	public async createPaidInscription(req: Request, res: Response): Promise<void> {
		const { dsEmail, idCabin } = req.body as PaidInscriptionAttributes
		const camper = await this.camperService.findByEmail(dsEmail)
		if (!camper) {
			res.status(404).json({ error: 'Não há campista registrado com o email ' + dsEmail })
			return
		}
		const { idEdition } = await this.editionService.findCurrent()
		const dsCode = CryptoJS.AES.encrypt(`${idEdition}${idCabin}${dsEmail}`, ENCRYPTION_KEY).toString()
		const result = await PaidInscription.create({ dsEmail, idCabin, idEdition, dsCode, blActivated: false })
		res.json(result)
	}

	public async createActivityTwitter(req: Request, res: Response): Promise<void> {
		const { dsAnswer, dsQuestionTag, tpActivity } = req.body as MissionAttributes
		const created = await Mission.create({ dsAnswer, dsQuestionTag, tpActivity })
		res.json(created)
	}

	public async updateEditionWithParticipants(req: Request, res: Response): Promise<void> {
		const { idEdition } = await this.editionService.findCurrent()
		const nrParticipants = await CamperEdition.count({ where: { idEdition } })
		await Edition.update({ nrParticipants }, { where: { idEdition } })
		res.json({ nrParticipants })
	}

	public async createNewEdition(req: Request, res: Response): Promise<void> {
		const edition = req.body as Edition
		const data = await Edition.create(edition)
		res.json(data)
	}

	public async initEdition(req: Request, res: Response): Promise<void> {
		const { idEdition } = await this.editionService.findCurrent()
		await Edition.update({ dtBegin: new Date() }, { where: { idEdition } })
		res.json({})
	}

	public async endEdition(req: Request, res: Response): Promise<void> {
		const { idEdition } = await this.editionService.findCurrent()
		const data = await Edition.update({ dtEnd: new Date() }, { where: { idEdition } })
		await Camper.update({ idCabin: null }, { where: { idCabin: { [Op.not]: null } } })
		res.json(data)
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
		for (const request of cabinRequests) {
			const idCamper = request.idCamper!
			request.isFirstEdition = Boolean(await CamperEdition.findOne({ where: { idCamper, idEdition: 1 } }))
		}

		const sorted = cabinRequests.sort((request, request2) => request.createdAt.getTime() - request2.createdAt.getTime())
		const groupedRequests = _.groupBy(sorted, 'idFirstOptionCabin')
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

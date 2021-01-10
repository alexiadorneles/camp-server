import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import _ from 'lodash'
import { Includeable, Op, where } from 'sequelize'
import { Cabin, CabinRequest, Camper, CamperEdition, CamperEditionAttributes, Status, Edition } from '../../models'
import { Admin } from '../../models/AdminModel'
import { JWTMediator } from '../routes/JWTMediator'
import { EditionService } from '../services'
import { FileUtils } from '../../util/FileUtils'

export class AdminController {
	constructor(private editionService: EditionService) {
		this.listCabinRequests = this.listCabinRequests.bind(this)
		this.endEdition = this.endEdition.bind(this)
		this.initEdition = this.initEdition.bind(this)
		this.updateEditionWithParticipants = this.updateEditionWithParticipants.bind(this)
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

	public async addCampersToFirstEdition(req: Request, res: Response): Promise<void> {
		const discordData = await FileUtils.readDiscordIDsCSV()
		const ids = discordData.map(obj => obj.discordID).map(Number)
		const campersFirstEdition = await Camper.findAll({ where: { nrDiscordID: { [Op.in]: ids } } })
		const created = await Promise.all(
			campersFirstEdition.map(camper => {
				const lineForCamper = discordData.find(data => Number(data.discordID) == camper.nrDiscordID)
				if (lineForCamper.cabinNumber) {
					return CamperEdition.create({
						idEdition: 1,
						idCamper: camper.idCamper,
						idCabin: lineForCamper.cabinNumber,
					})
				}
				Promise.resolve(null)
			}),
		)

		res.json(created.filter(Boolean))
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

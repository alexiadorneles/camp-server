import { Request, Response } from 'express'
import {
	Camper,
	CamperActivityAttributes,
	CamperActivityCreationAttributes,
	CamperAttributes,
	CamperEdition,
	CamperEditionAttributes,
} from '../../models'
import { PaidInscription } from '../../models/PaidInscription'
import { Country } from '../../types/Places'
import { JWTMediator } from '../routes/middlewares/JWTMediator'
import { EditionService } from '../services'
import { CamperService } from '../services/CamperService'

export class CamperController {
	constructor(private editionService: EditionService, private camperService: CamperService) {
		this.create = this.create.bind(this)
		this.loginOrRegister = this.loginOrRegister.bind(this)
		this.setCabin = this.setCabin.bind(this)
		this.update = this.update.bind(this)
		this.activatePaidInscription = this.activatePaidInscription.bind(this)
	}

	public async activatePaidInscription(req: Request, res: Response): Promise<void> {
		const { code } = req.body
		const { idCabin, idPaidInscription, dsEmail } = await PaidInscription.findOne({ where: { dsCode: code } })
		const { idCamper } = await Camper.findOne({ where: { dsEmail } })
		await this.addCamperInCabin(idCamper, idCabin)
		await PaidInscription.update({ blActivated: true }, { where: { idPaidInscription } })
		res.status(201).json({ success: true })
	}

	public async loginOrRegister(req: Request, res: Response): Promise<void> {
		const { idGoogle } = req.body
		const camper = await Camper.findOne({ where: { idGoogle } })

		if (!camper) {
			this.create(req, res)
			return
		}

		const token = JWTMediator.sign({ idCamper: Number(camper.idCamper), password: '' })
		res.json({ camper, token })
	}

	public async create(req: Request, res: Response): Promise<void> {
		const camperAttributes = req.body
		try {
			const camper = await Camper.create(camperAttributes)
			const token = JWTMediator.sign({ idCamper: camper.idCamper, password: '' })
			res.json({ camper, token })
		} catch (error) {
			res.status(400).json({ error })
		}
	}

	public async login(req: Request, res: Response): Promise<void> {
		const [hashType, hash] = req.headers.authorization.split(' ')
		const { idCamper } = JWTMediator.decode(hash)
		try {
			const camper = await Camper.findByPk(idCamper)
			if (!camper) {
				res.status(401).json({ error: 'User not found' })
				return
			}

			const token = JWTMediator.sign({ idCamper: Number(idCamper), password: '' })
			res.json({ camper, token })
		} catch (error) {
			res.status(401).json({ error })
		}
	}

	public async findOne(req: Request, res: Response): Promise<void> {
		const { signedInUser } = req.params
		const camper = await Camper.findByPk(signedInUser)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}
		res.json(camper)
	}

	public async update(req: Request, res: Response): Promise<void> {
		const idCamper = Number(req.params.signedInUser)
		const requestBody = req.body as CamperAttributes
		if (requestBody.tpCountry !== Country.BRAZIL) {
			requestBody.tpState = null
		}
		const updatedCamper = await this.camperService.update(requestBody, { idCamper })
		res.json(updatedCamper)
	}

	public async setCabin(req: Request, res: Response): Promise<void> {
		const { idCabin } = req.body as Partial<CamperAttributes>
		const idCamper = Number(req.params.idCamper)
		const camperEdition = await this.addCamperInCabin(idCamper, idCabin)
		res.json(camperEdition)
	}

	private async addCamperInCabin(idCamper: number, idCabin: number): Promise<CamperEdition> {
		await Camper.update({ idCabin }, { where: { idCamper } })
		const [camperEdition] = await this.createCamperEdition(idCabin, idCamper)
		return camperEdition
	}

	private async createCamperEdition(idCabin: number, idCamper: number): Promise<[CamperEdition, boolean]> {
		const { idEdition } = await this.editionService.findCurrent()
		const where: Partial<CamperEditionAttributes> = { idCabin, idCamper, idEdition }
		return CamperEdition.findOrCreate({ where })
	}

	public async answerActivity(req: Request, res: Response): Promise<void> {
		const activityInfo = req.body as CamperActivityCreationAttributes
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}

		const created = await camper.createCamperActivity(activityInfo)
		res.json(created)
	}

	public async answerTimedOut(req: Request, res: Response): Promise<void> {
		const { idActivity, idEdition, idRound } = req.body
		const { idCamper } = req.params
		const camper = await Camper.findByPk(idCamper)
		if (!camper) {
			res.status(400).json({ error: 'Camper not found' })
		}

		const camperActivity: Partial<CamperActivityAttributes> = {
			blCorrect: false,
			// idRound,
			idActivity,
			idCamper: Number(idCamper),
			idActivityOption: null,
			idEdition,
		}

		const created = await camper.createCamperActivity(camperActivity)
		res.json(created)
	}
}

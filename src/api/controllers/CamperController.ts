import { Request, Response } from 'express'
import {
	Camper,
	CamperActivityAttributes,
	CamperActivityCreationAttributes,
	CamperAttributes,
	CamperCreationAttributes,
} from '../../models'
import { Country } from '../../types/Places'
import { JWTMediator } from '../routes/JWTMediator'

export class CamperController {
	constructor() {
		this.create = this.create.bind(this)
		this.loginOrRegister = this.loginOrRegister.bind(this)
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

	public async completeRegister(req: Request, res: Response): Promise<void> {
		const idCamper = Number(req.params.signedInUser)
		const camper = req.body as Partial<CamperAttributes>
		const [rows, data] = await Camper.update(
			{ ...camper, blRegisterCompleted: true },
			{
				where: { idCamper },
				fields: [
					'nrDiscordID',
					'dsInstagramNick',
					'dtBirth',
					'tpState',
					'tpCountry',
					'dsPronouns',
					'dsDescription',
					'blRegisterCompleted',
				],
			},
		)

		res.json(data ? data : rows)
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
		const idCamper = req.params.signedInUser
		const requestBody = req.body as CamperCreationAttributes
		if (requestBody.tpCountry !== Country.BRAZIL) {
			requestBody.tpState = null
		}
		const [rows, data] = await Camper.update(requestBody, { where: { idCamper } })
		res.json(data ? data[0] : rows)
	}

	public async setCabin(req: Request, res: Response): Promise<void> {
		const { idCabin } = req.body as Partial<CamperAttributes>
		const { idCamper } = req.params
		const [rows, data] = await Camper.update({ idCabin }, { where: { idCamper } })
		res.json(data ? data[0] : rows)
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

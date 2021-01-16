import { Request, Response } from 'express'
import { JWTMediator } from './JWTMediator'
import { Camper } from '../../../models'

export async function authMiddleware(req: Request, res: Response, next: Function): Promise<void> {
	const [, token] = req.headers.authorization.split(' ')
	try {
		const payload = await JWTMediator.verify(token)
		const camper = await Camper.findByPk(payload.idCamper)

		if (!camper) {
			res.status(401).json('User not found')
			return
		}

		req.params.signedInUser = payload.idCamper as any
		next()
	} catch (error) {
		res.status(401).json({ error })
	}
}

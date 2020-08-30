import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { JWTMediator } from './JWTMediator'
import { Admin } from '../../models/AdminModel'

export async function adminMiddleware(req: Request, res: Response, next: Function): Promise<void> {
	const [, token] = req.headers.authorization.split(' ')
	try {
		const { idGoogleAdmin } = await JWTMediator.verify(token)
		if (!idGoogleAdmin) {
			res.status(403).json('Nice try')
			return
		}

		const adm = await Admin.findOne({ where: { idGoogle: idGoogleAdmin } })
		if (!adm) {
			res.status(403).json(`You're not an Admin`)
			return
		}

		next()
	} catch (error) {
		res.status(401).json({ error })
	}
}

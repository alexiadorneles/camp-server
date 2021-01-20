import { Request, Response } from 'express'
import passport from 'passport'
import Strategy from 'passport-discord'
import base64url from 'base64url'
import { Camper } from '../../models'

const { FRONTEND_URL } = process.env

export class DiscordController {
	public handleRedirect = (req: Request, _: Response, next: Function) => {
		return passport.authenticate('discord', {
			failWithError: true,
			successRedirect: '/discord/login-success?state=' + req.query.state,
		})(req, _, next)
	}

	public loginSuccessWithDiscord = async (req: Request, res: Response) => {
		const user = (req.session as any).passport.user as Strategy.Profile
		const { idCamper } = JSON.parse(base64url.decode(req.query.state as string))
		try {
			await Camper.update({ dsDiscordID: user.id }, { where: { idCamper } })
			res.redirect(FRONTEND_URL + '/secured/profile')
		} catch (err) {
			res.status(400).json({ text: 'Um erro aconteceu, comunique no Discord. Erro: ' + err.message })
		}
	}
}

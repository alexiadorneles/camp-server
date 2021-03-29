import base64url from 'base64url'
import { Request, Response } from 'express'
import passport from 'passport'
import Strategy from 'passport-discord'
import { CamperService } from '../services/CamperService'

const { FRONTEND_URL } = process.env

export class DiscordController {
	constructor(private camperService: CamperService) {}

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
			await this.camperService.update({ dsDiscordID: user.id }, { idCamper })
			res.redirect(FRONTEND_URL + '/secured/profile')
		} catch (err) {
			res.status(400).json({ text: 'Um erro aconteceu, comunique no Discord. Erro: ' + err.message })
		}
	}
}

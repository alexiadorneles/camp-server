import base64url from 'base64url'
import express, { Request, Response } from 'express'
import session from 'express-session'
import passport from 'passport'
import { STRATEGY_PROVIDERS } from '../strategies/poviders'
import Strategy from 'passport-discord'
import { Camper } from '../../models'

const { FRONTEND_URL } = process.env

STRATEGY_PROVIDERS.forEach(provider => passport.use(provider.provide()))

const routes = express.Router()

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})

export namespace DiscordRoutes {
	export function register(app: { use: Function }): void {
		app.use('/discord', passport.initialize())
		app.use('/discord', passport.session())
		app.use(
			'/discord',
			session({
				secret: 'some secret',
				cookie: { maxAge: 60000 * 60 * 24 },
				saveUninitialized: false,
				resave: true,
			}),
		)
		routes.get('/redirect', (req: Request, _, next: Function) => {
			return passport.authenticate('discord', {
				failWithError: true,
				successRedirect: '/discord/login-success?state=' + req.query.state,
			})(req, _, next)
		})

		routes.get('/login-success', async (req: Request, res: Response) => {
			const user = (req.session as any).passport.user as Strategy.Profile
			const { idCamper } = JSON.parse(base64url.decode(req.query.state as string))
			try {
				await Camper.update({ dsDiscordID: user.id }, { where: { idCamper } })
				res.redirect(FRONTEND_URL + '/secured/profile')
			} catch (err) {
				res.status(400).json({ text: 'Um erro aconteceu, comunique no Discord. Erro: ' + err.message })
			}
		})
		app.use('/discord', routes)
	}
}

import base64url from 'base64url'
import express, { Request, Response } from 'express'
import session from 'express-session'
import passport from 'passport'
import { STRATEGY_PROVIDERS } from '../strategies/poviders'

STRATEGY_PROVIDERS.forEach(provider => passport.use(provider.provide()))

const routes = express.Router()

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})

const getUrl = (req: Request) => {
	return req.query && req.query.state
}

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

		routes.get('/login-success', (req: Request, res: Response) => {
			const user = (req.session as any).passport.user
			const { idCamper } = JSON.parse(base64url.decode(req.query.state as string))
			console.log('HERE IN SUCCESS', req.query)
			res.json({ ok: true })
		})
		app.use('/discord', routes)
	}
}

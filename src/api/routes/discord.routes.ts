import express, { Request, Response } from 'express'
import session from 'express-session'
import passport from 'passport'
import { STRATEGY_PROVIDERS } from '../strategies/poviders'

STRATEGY_PROVIDERS.forEach(provider => passport.use(provider.provide()))

const routes = express.Router()

routes.get(
	'/redirect',
	passport.authenticate('discord', {
		failWithError: false,
		successMessage: 'Sucesso!',
		failureMessage: 'Erro!',
	}),
	(req: Request, res: Response) => res.status(201).json('DONE'),
)

export namespace DiscordRoutes {
	export function register(app: { use: Function }): void {
		app.use('/discord', routes)
		app.use(
			'/discord',
			session({
				secret: 'some secret',
				cookie: { maxAge: 60000 * 60 * 24 },
				saveUninitialized: false,
				resave: true,
			}),
		)
		app.use('/discord', passport.initialize())
		app.use('/discord', passport.session())
	}
}

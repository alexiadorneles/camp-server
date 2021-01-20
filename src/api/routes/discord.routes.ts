import express from 'express'
import { RequestHandler } from 'express-serve-static-core'
import session from 'express-session'
import passport from 'passport'
import { DiscordController } from '../controllers/DiscordController'
import { STRATEGY_PROVIDERS } from '../strategies/poviders'

STRATEGY_PROVIDERS.forEach(provider => passport.use(provider.provide()))

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})

export namespace DiscordRoutes {
	export function register(app: { use: Function }): void {
		const controller = new DiscordController()
		const routes = express.Router()
		app.use('/discord', passport.initialize())
		app.use('/discord', passport.session())
		app.use('/discord', configureSession())
		routes.get('/redirect', controller.handleRedirect)
		routes.get('/login-success', controller.loginSuccessWithDiscord)
		app.use('/discord', routes)
	}

	function configureSession(): RequestHandler {
		return session({
			secret: 'some secret',
			cookie: { maxAge: 60000 * 60 * 24 },
			saveUninitialized: false,
			resave: true,
		})
	}
}

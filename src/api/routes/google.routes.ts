import express from 'express'
import { GoogleController } from '../controllers/GoogleController'
import { CamperService } from '../services/CamperService'

export namespace GoogleRoutes {
	export function register(app: { use: Function }): void {
		const camperService = new CamperService()
		const controller = new GoogleController(camperService)
		const routes = express.Router()
		routes.get('/auth', controller.googleLoginOrRegister)
		app.use('/google', routes)
	}
}

import { Router } from 'express'
import { Middleware } from '../../../types/Middleware'
import { AdminController } from '../../controllers/AdminController'
import { EditionService } from '../../services/EditionService'
import { CamperService } from '../../services/CamperService'

export namespace AdminRouterBuilder {
	export function build(
		editionService: EditionService,
		camperService: CamperService,
		adminMiddleware: Middleware,
	): Router {
		const routes = Router()
		const controller = new AdminController(editionService, camperService)
		routes.get('/', controller.login)
		routes.get('/test', adminMiddleware, controller.listCabinRequests)
		routes.put('/init-edition/', adminMiddleware, controller.initEdition)
		routes.post('/end-request', adminMiddleware, controller.setCamperInCabin)
		routes.post('/start-edition', adminMiddleware, controller.createNewEdition)
		routes.put('/end-edition', adminMiddleware, controller.endEdition)
		routes.put('/participants-in-edition', adminMiddleware, controller.updateEditionWithParticipants)
		routes.post('/twitter-activity', adminMiddleware, controller.createActivityTwitter)
		routes.post('/paid-inscription', adminMiddleware, controller.createPaidInscription)
		return routes
	}
}

import { Router } from 'express'
import { CabinRequestController } from '../../controllers/CabinRequestController'
import { EditionService } from '../../services/EditionService'
import { Middleware } from '../../../types/Middleware'

export namespace CabinRequestsRouterBuilder {
	export function build(
		editionService: EditionService,
		authMiddleware: Middleware,
		ownerMiddleware: Middleware,
	): Router {
		const routes = Router()
		const controller = new CabinRequestController(editionService)
		routes.post('', authMiddleware, controller.create)
		routes.get('/check/:idCamper', authMiddleware, ownerMiddleware, controller.camperHasRequestedCabin)
		routes.get('/count', authMiddleware, controller.countCabinRequests)
		return routes
	}
}

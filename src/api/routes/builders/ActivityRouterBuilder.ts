import { Router } from 'express'
import { Middleware } from '../../../types/Middleware'
import { ActivityController } from '../../controllers/ActivityController'
import { EditionService } from '../../services/EditionService'

export namespace ActivityRouterBuilder {
	export function build(
		editionService: EditionService,
		authMiddleware: Middleware,
		adminMiddleware: Middleware,
	): Router {
		const routes = Router()
		const controller = new ActivityController(editionService)
		routes.post('/generate', adminMiddleware, controller.generateFromCSV)
		routes.post('/config', adminMiddleware, controller.configureForCurrentEdition)
		routes.put('/end-current/:idActivity', authMiddleware, controller.endCurrentActivity)
		return routes
	}
}

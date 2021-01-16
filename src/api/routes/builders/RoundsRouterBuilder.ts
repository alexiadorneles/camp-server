import { Router } from 'express'
import { Middleware } from '../../../types/Middleware'
import { RoundController } from '../../controllers/RoundController'
import { EditionService } from '../../services/EditionService'
import { ActivityService } from '../../services/ActivityService'

export namespace RoundsRouterBuilder {
	export function build(
		editionService: EditionService,
		activityService: ActivityService,
		authMiddleware: Middleware,
		adminMiddleware: Middleware,
		ownerMiddleware: Middleware,
	): Router {
		const routes = Router()
		const controller = new RoundController(editionService, activityService)
		routes.get('/random/:quantity', adminMiddleware, controller.generateRandomByNumber)
		routes.post('/generate', adminMiddleware, controller.generateRoundFromConfig)
		routes.get('/campers/:idCamper', authMiddleware, ownerMiddleware, controller.loadRoundForCamper)
		routes.put('/finish/:idRound', authMiddleware, ownerMiddleware, controller.finish)
		return routes
	}
}

import { Router } from 'express'
import { Middleware } from '../../../types/Middleware'
import { RankingController } from '../../controllers/RankingController'
import { EditionService } from '../../services/EditionService'

export namespace RankingRouterBuilder {
	export function build(editionService: EditionService, adminMiddleware: Middleware): Router {
		const routes = Router()
		const controller = new RankingController(editionService)
		routes.get('/', adminMiddleware, controller.calculateRanking)
		routes.put('/end-route', adminMiddleware, controller.endAllRounds)
		return routes
	}
}

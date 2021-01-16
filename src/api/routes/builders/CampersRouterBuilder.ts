import { Router } from 'express'
import { Middleware } from '../../../types/Middleware'
import { CamperController } from '../../controllers/CamperController'
import { EditionService } from '../../services/EditionService'

export namespace CampersRouterBuilder {
	export function build(
		editionService: EditionService,
		authMiddleware: Middleware,
		ownerMiddleware: Middleware,
	): Router {
		const routes = Router()
		const controller = new CamperController(editionService)
		routes.get('/login', controller.login)
		routes.post('/', controller.loginOrRegister)
		routes.put('/complete-register', authMiddleware, ownerMiddleware, controller.completeRegister)
		routes.put('/', authMiddleware, ownerMiddleware, controller.update)
		routes.get('/profile', authMiddleware, controller.findOne)
		routes.put('/:idCamper/cabin', authMiddleware, controller.setCabin)
		routes.post('/:idCamper/answer', authMiddleware, ownerMiddleware, controller.answerActivity)
		routes.post('/:idCamper/answer-timed-out', authMiddleware, ownerMiddleware, controller.answerTimedOut)
		return routes
	}
}

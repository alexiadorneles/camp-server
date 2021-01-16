import { Router } from 'express'
import { EditionController } from '../../controllers/EditionController'
import { EditionService } from '../../services/EditionService'

export namespace EditionRouterBuilder {
	export function build(editionService: EditionService): Router {
		const routes = Router()
		const controller = new EditionController(editionService)
		routes.get('/current', controller.findCurrent)
		return routes
	}
}

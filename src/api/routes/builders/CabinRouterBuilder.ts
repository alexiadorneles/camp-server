import { Router } from 'express'
import { CabinController } from '../../controllers'

export namespace CabinRouterBuilder {
	export function build(): Router {
		const routes = Router()
		const controller = new CabinController()
		routes.get('/', controller.findAllIncludingCampers)
		return routes
	}
}

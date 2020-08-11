import express from 'express'
import '../../database/associations'
import { CabinController, CabinRequestController } from '../controllers'
import { CamperController } from '../controllers/CamperController'
import { EditionController } from '../controllers/EditionController'
import { EditionService } from '../services'

const routes = express.Router()

// services
const editionService = new EditionService()

function generateCabinRoutes(): void {
	const controller = new CabinController()
	routes.get('/cabins', controller.findAllIncludingCampers)
}

function generateCabinRequestRoutes(): void {
	const controller = new CabinRequestController(editionService)
	routes.post('/cabin-requests', controller.create)
	routes.get('/cabin-requests/check/:idCamper', controller.camperHasRequestedCabin)
}

function generateCamperRequestRoutes(): void {
	const controller = new CamperController()
	routes.get('/campers/:idCamper', controller.findOne)
	routes.put('/campers/:idCamper', controller.update)
	routes.put('/campers/:idCamper/cabin', controller.setCabin)
}

function generateEditionRoutes(): void {
	const controller = new EditionController(editionService)
	routes.get('/editions/current', controller.findCurrent)
}

generateCabinRoutes()
generateCabinRequestRoutes()
generateCamperRequestRoutes()
generateEditionRoutes()

// tslint:disable-next-line: no-default-export
export default routes

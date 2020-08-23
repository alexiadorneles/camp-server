import express from 'express'
import { CabinController, CabinRequestController } from '../controllers'
import { CamperController } from '../controllers/CamperController'
import { EditionController } from '../controllers/EditionController'
import { EditionService } from '../services'
import { ActivityController } from '../controllers/ActivityController'
import { RoundController } from '../controllers/RoundController'
import { ActivityService } from '../services/ActivityService'

const routes = express.Router()

// services
const editionService = new EditionService()
const activityService = new ActivityService()

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
	routes.post('/campers/:idCamper/answer', controller.answerActivity)
	routes.post('/campers/:idCamper/answer-timed-out', controller.answerTimedOut)
}

function generateEditionRoutes(): void {
	const controller = new EditionController(editionService)
	routes.get('/editions/current', controller.findCurrent)
}

function generateActivityRoutes(): void {
	const controller = new ActivityController()
	routes.post('/activities/generate', controller.generateFromCSV)
}

function generateRoundRoutes(): void {
	const controller = new RoundController(editionService, activityService)
	routes.post('/rounds/generate', controller.generateRoundFromConfig)
	routes.get('/rounds/:idCamper', controller.loadRoundForCamper)
}

generateCabinRoutes()
generateCabinRequestRoutes()
generateCamperRequestRoutes()
generateEditionRoutes()
generateActivityRoutes()
generateRoundRoutes()

// tslint:disable-next-line: no-default-export
export default routes

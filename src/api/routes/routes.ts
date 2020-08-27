import express from 'express'
import { CabinController, CabinRequestController } from '../controllers'
import { ActivityController } from '../controllers/ActivityController'
import { CamperController } from '../controllers/CamperController'
import { EditionController } from '../controllers/EditionController'
import { RankingController } from '../controllers/RankingController'
import { RoundController } from '../controllers/RoundController'
import { EditionService } from '../services'
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
	routes.get('/cabin-requests/count', controller.countCabinRequests)
}

function generateCamperRequestRoutes(): void {
	const controller = new CamperController()
	routes.get('/campers/:idCamper', controller.findOne)
	routes.put('/campers/:idCamper', controller.update)
	routes.post('/campers/', controller.create)
	routes.put('/campers/:idCamper/cabin', controller.setCabin)
	routes.post('/campers/:idCamper/answer', controller.answerActivity)
	routes.post('/campers/:idCamper/answer-timed-out', controller.answerTimedOut)
}

function generateEditionRoutes(): void {
	const controller = new EditionController(editionService)
	routes.get('/editions/current', controller.findCurrent)
}

function generateActivityRoutes(): void {
	const controller = new ActivityController(editionService)
	routes.post('/activities/generate', controller.generateFromCSV)
	routes.post('/activities/config', controller.configureForCurrentEdition)
}

function generateRoundRoutes(): void {
	const controller = new RoundController(editionService, activityService)
	routes.post('/rounds/generate', controller.generateRoundFromConfig)
	routes.get('/rounds/campers/:idCamper', controller.loadRoundForCamper)
	routes.put('/rounds/finish/:idRound', controller.finish)
}

function generateRankingRoutes(): void {
	const controller = new RankingController(editionService)
	routes.post('/rankings/', controller.generateRanking)
}

generateCabinRoutes()
generateCabinRequestRoutes()
generateCamperRequestRoutes()
generateEditionRoutes()
generateActivityRoutes()
generateRoundRoutes()
generateRankingRoutes()

// tslint:disable-next-line: no-default-export
export default routes

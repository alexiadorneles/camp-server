import express from 'express'
import { CabinController, CabinRequestController } from '../controllers'
import { ActivityController } from '../controllers/ActivityController'
import { CamperController } from '../controllers/CamperController'
import { EditionController } from '../controllers/EditionController'
import { RankingController } from '../controllers/RankingController'
import { RoundController } from '../controllers/RoundController'
import { EditionService } from '../services'
import { ActivityService } from '../services/ActivityService'
import { authMiddleware } from './AuthMiddleware'

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
	routes.post('/cabin-requests', authMiddleware, controller.create)
	routes.get('/cabin-requests/check/:idCamper', authMiddleware, controller.camperHasRequestedCabin)
	routes.get('/cabin-requests/count', authMiddleware, controller.countCabinRequests)
}

function generateCamperRequestRoutes(): void {
	const controller = new CamperController()
	// LOGIN AND SIGNING
	routes.post('/campers/', controller.create)
	routes.get('/login', controller.login)
	// OTHER METHODS
	routes.get('/campers/:idCamper', authMiddleware, controller.findOne)
	routes.put('/campers/:idCamper', authMiddleware, controller.update)
	routes.put('/campers/:idCamper/cabin', authMiddleware, controller.setCabin)
	routes.post('/campers/:idCamper/answer', authMiddleware, controller.answerActivity)
	routes.post('/campers/:idCamper/answer-timed-out', authMiddleware, controller.answerTimedOut)
}

function generateEditionRoutes(): void {
	const controller = new EditionController(editionService)
	routes.get('/editions/current', authMiddleware, controller.findCurrent)
}

function generateActivityRoutes(): void {
	const controller = new ActivityController(editionService)
	routes.post('/activities/generate', authMiddleware, controller.generateFromCSV)
	routes.post('/activities/config', authMiddleware, controller.configureForCurrentEdition)
}

function generateRoundRoutes(): void {
	const controller = new RoundController(editionService, activityService)
	routes.post('/rounds/generate', authMiddleware, controller.generateRoundFromConfig)
	routes.get('/rounds/campers/:idCamper', authMiddleware, controller.loadRoundForCamper)
	routes.put('/rounds/finish/:idRound', authMiddleware, controller.finish)
}

function generateRankingRoutes(): void {
	const controller = new RankingController(editionService)
	routes.post('/rankings/', authMiddleware, controller.generateRanking)
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

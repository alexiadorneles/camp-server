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
import { ownerMiddleware } from './OwnerMiddleware'

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
	routes.get('/cabin-requests/check/:idCamper', authMiddleware, ownerMiddleware, controller.camperHasRequestedCabin)
	routes.get('/cabin-requests/count', authMiddleware, controller.countCabinRequests)
}

function generateCamperRequestRoutes(): void {
	const controller = new CamperController()
	// LOGIN AND SIGNING
	routes.post('/campers/', controller.loginOrRegister)
	routes.get('/login', controller.login)
	// OTHER METHODS
	routes.put('/campers/complete-register', authMiddleware, ownerMiddleware, controller.completeRegister)
	routes.put('/campers/', authMiddleware, ownerMiddleware, controller.update)
	routes.get('/campers/:idCamper', authMiddleware, ownerMiddleware, controller.findOne)
	routes.put('/campers/:idCamper/cabin', authMiddleware, controller.setCabin)
	routes.post('/campers/:idCamper/answer', authMiddleware, ownerMiddleware, controller.answerActivity)
	routes.post('/campers/:idCamper/answer-timed-out', authMiddleware, ownerMiddleware, controller.answerTimedOut)
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
	routes.get('/rounds/campers/:idCamper', authMiddleware, ownerMiddleware, controller.loadRoundForCamper)
	routes.put('/rounds/finish/:idRound', authMiddleware, ownerMiddleware, controller.finish)
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

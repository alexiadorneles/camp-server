import express from 'express'
import { CabinController, CabinRequestController } from '../controllers'
import { ActivityController } from '../controllers/ActivityController'
import { AdminController } from '../controllers/AdminController'
import { CamperController } from '../controllers/CamperController'
import { EditionController } from '../controllers/EditionController'
import { RankingController } from '../controllers/RankingController'
import { RoundController } from '../controllers/RoundController'
import { EditionService } from '../services'
import { ActivityService } from '../services/ActivityService'
import { adminMiddleware } from './AdminMiddleware'
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

function generateCamperRoutes(): void {
	const controller = new CamperController(editionService)
	// LOGIN AND SIGNING
	routes.post('/campers/', controller.loginOrRegister)
	routes.get('/login', controller.login)
	// OTHER METHODS
	routes.put('/campers/complete-register', authMiddleware, ownerMiddleware, controller.completeRegister)
	routes.put('/campers/', authMiddleware, ownerMiddleware, controller.update)
	routes.get('/campers/profile', authMiddleware, controller.findOne)
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
	routes.post('/activities/generate', adminMiddleware, controller.generateFromCSV)
	routes.post('/activities/config', adminMiddleware, controller.configureForCurrentEdition)
}

function generateRoundRoutes(): void {
	const controller = new RoundController(editionService, activityService)
	routes.post('/rounds/generate', adminMiddleware, controller.generateRoundFromConfig)
	routes.get('/rounds/campers/:idCamper', authMiddleware, ownerMiddleware, controller.loadRoundForCamper)
	routes.put('/rounds/finish/:idRound', authMiddleware, ownerMiddleware, controller.finish)
}

function generateRankingRoutes(): void {
	const controller = new RankingController(editionService)
	// routes.post('/rankings/', adminMiddleware, controller.generateRanking)
	routes.get('/rankings/', adminMiddleware, controller.calculateRanking)
	routes.put('/rankings/end-route', adminMiddleware, controller.endAllRounds)
}

generateCabinRoutes()
generateCabinRequestRoutes()
generateCamperRoutes()
generateEditionRoutes()
generateActivityRoutes()
generateRoundRoutes()
generateRankingRoutes()

function generateADMRoutes(): void {
	const controller = new AdminController(editionService)
	routes.get('/admins/', controller.login)
	routes.get('/admins/test', adminMiddleware, controller.listCabinRequests)
	routes.post('/admins/end-request', adminMiddleware, controller.setCamperInCabin)
	routes.post('/admins/populate-first-edition', adminMiddleware, controller.addCampersToFirstEdition)
	routes.post('/admins/start-edition', adminMiddleware, controller.initEdition)
	routes.put('/admins/end-edition', adminMiddleware, controller.endEdition)
}

generateADMRoutes()

// tslint:disable-next-line: no-default-export
export default routes

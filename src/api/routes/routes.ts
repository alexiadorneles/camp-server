import express from 'express'
import '../../database/associations'
import { CabinController, CabinRequestController } from '../controllers'
import { CamperController } from '../controllers/CamperController'
import { EditionController } from '../controllers/EditionController'

const routes = express.Router()

routes.get('/', (req, res) => {
	res.send('OK WORKING')
})

function generateCabinRoutes(): void {
	const controller = new CabinController()
	routes.get('/cabins', controller.findAllIncludingCampers)
}

function generateCabinRequestRoutes(): void {
	const controller = new CabinRequestController()
	routes.post('/cabin-requests', controller.create)
}

function generateCamperRequestRoutes(): void {
	const controller = new CamperController()
	routes.get('/campers/:idCamper', controller.findOne)
	routes.put('/campers/:idCamper', controller.update)
}

function generateEditionRoutes(): void {
	const controller = new EditionController()
	routes.get('/editions/current', controller.findCurrent)
}

generateCabinRoutes()
generateCabinRequestRoutes()
generateCamperRequestRoutes()
generateEditionRoutes()

// tslint:disable-next-line: no-default-export
export default routes

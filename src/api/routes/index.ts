import express from 'express'
import '../../database/associations'
import { CabinController, CabinRequestController } from '../controllers'

const routes = express.Router()

routes.get('/', (req, res) => {
	res.send('OK WORKING')
})

function generateCabinRoutes(): void {
	const controller = new CabinController()
	routes.get('/cabin', controller.findAll)
	routes.get('/cabin/included', controller.findAllIncludingCampers)
}

function generateCabinRequestRoutes(): void {
	const controller = new CabinRequestController()
	routes.post('/cabin-request', controller.create)
}

generateCabinRoutes()
generateCabinRequestRoutes()

// tslint:disable-next-line: no-default-export
export default routes

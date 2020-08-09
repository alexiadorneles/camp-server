import express from 'express'
import { CabinController } from '../controllers/CabinController'

import '../../database/associations'

const routes = express.Router()

routes.get('/', (req, res) => {
	res.send('OK WORKING')
})

function generateCabinRoutes() {
	const controller = new CabinController()
	routes.get('/cabin', controller.findAll)
	routes.get('/cabin/included', controller.findAllIncludingCampers)
}

generateCabinRoutes()

// tslint:disable-next-line: no-default-export
export default routes

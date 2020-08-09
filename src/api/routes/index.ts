import express from 'express'
import { CabinController } from '../controllers/CabinController'

const routes = express.Router()

routes.get('/', (req, res) => {
	res.send('OK WORKING')
})

function generateCabinRoutes() {
	const controller = new CabinController()
	routes.get('/cabin', controller.findAll)
}

generateCabinRoutes()

// tslint:disable-next-line: no-default-export
export default routes

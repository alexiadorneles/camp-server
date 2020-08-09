import express from 'express'
import routes from './routes'

import '../database'

const app = express()

export function configureAPI() {
	app.use(express.json())
	app.use(routes)

	app.listen(3333)
}

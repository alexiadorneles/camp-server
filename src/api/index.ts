import express from 'express'
import routes from './routes/routes'
import cors from 'cors'

import '../database'
import '../database/associations'

const app = express()

export function configureAPI(): void {
	app.use(express.json())
	app.use(
		cors(),
		// cors({
		// 	origin: 'http://localhost:3000/*',
		// 	optionsSuccessStatus: 200,
		// }),
	)
	app.use(routes)

	app.listen(3333)
}

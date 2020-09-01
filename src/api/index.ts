import express from 'express'
import routes from './routes/routes'
import cors from 'cors'

import '../database'
import '../database/associations'

const { FRONTEND_URL, ADMIN_PANEL_URL } = process.env

const app = express()
const whitelist = [ADMIN_PANEL_URL, FRONTEND_URL]
const corsOptions = {
	origin: function(origin: string, callback: Function): void {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			// callback(null, true)
			callback(new Error('Not allowed by CORS'))
		}
	},
}

export function configureAPI(): void {
	app.use(express.json())
	// app.use(cors({ origin: [ADMIN_PANEL_URL, FRONTEND_URL] }))
	app.use(cors(corsOptions))
	app.use(routes)

	app.listen(80)
}

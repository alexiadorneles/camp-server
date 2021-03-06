import cors from 'cors'
import express from 'express'
import '../database'
import '../database/associations'
import { CampRoutes } from './routes/camp.routes'
import { DiscordRoutes } from './routes/discord.routes'
import { GoogleRoutes } from './routes/google.routes'

const { FRONTEND_URL, ADMIN_PANEL_URL } = process.env

const app = express()
const whitelist = [ADMIN_PANEL_URL, FRONTEND_URL]
const corsOptions = {
	origin: function (origin: string, callback: Function): void {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			console.log('-----------------')
			console.log('origin', origin)
			console.log('whitelist', whitelist)
			console.log('-----------------')
			// callback(null, true)
			callback(new Error('Not allowed by CORS'))
		}
	},
}

export function configureAPI(): void {
	app.use(express.json())
	app.use(cors(corsOptions))
	CampRoutes.register(app)
	DiscordRoutes.register(app)
	GoogleRoutes.register(app)
	app.listen(process.env.PORT || 3000, () => console.log('Escutando!'))
}

import dotenv from 'dotenv'
import { configureAPI } from './api'
import { CampBot } from './discord/CampBot'
import { watchForMissionWinner } from './twitter/TwitterHandler'
dotenv.config()
configureAPI()
// new CampBot()
// setInterval(watchForMissionWinner, 15 * 1000)

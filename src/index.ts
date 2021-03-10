import { CamperService } from './api/services/CamperService'
import dotenv from 'dotenv'
import { configureAPI } from './api'
import { CampBot } from './discord/CampBot'
import { watchForMissionWinner } from './twitter/TwitterHandler'
dotenv.config()
configureAPI()
new CampBot(new CamperService())
setInterval(watchForMissionWinner, 15 * 50000)

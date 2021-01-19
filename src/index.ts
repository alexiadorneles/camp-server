import dotenv from 'dotenv'
dotenv.config()
import { configureAPI } from './api'
import { CampBot } from './discord/CampBot'
configureAPI()
new CampBot()

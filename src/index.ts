import dotenv from 'dotenv'
dotenv.config()
import { configureAPI } from './api'
configureAPI()
console.log('Camp server listening in port')

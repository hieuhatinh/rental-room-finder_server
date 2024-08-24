import express from 'express'

import { chatbotController } from '../controllers/index.js'

const chatbotRouter = express.Router()

chatbotRouter.post('/webhook', chatbotController.handleAgent)

export default chatbotRouter

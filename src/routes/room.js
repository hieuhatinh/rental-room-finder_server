import express from 'express'

import { roomController } from '../controllers/index.js'

const roomRouter = express.Router()

roomRouter.post('/search-rooms-by-chatbot', roomController.searchRoom)

export default roomRouter

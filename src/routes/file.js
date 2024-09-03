import express from 'express'

import { fileController } from '../controllers/index.js'

const fileRouter = express.Router()

fileRouter.post('/delete', fileController.deleteFileCloudinary)

export default fileRouter

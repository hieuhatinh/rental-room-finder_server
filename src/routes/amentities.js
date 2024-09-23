import express from 'express'

import { amentitiesController } from '../controllers/index.js'

const amentitiesRouter = express.Router()

amentitiesRouter.get('/get-all', amentitiesController.getAllAmentities)

export default amentitiesRouter

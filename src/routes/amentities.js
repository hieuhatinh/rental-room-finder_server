import express from 'express'

import { amentitiesController } from '../controllers/index.js'

const amentitiesRouter = express.Router()

amentitiesRouter.get('/get-all', amentitiesController.getAllAmentities)
amentitiesRouter.get('/get-amentities-id', amentitiesController.getAmentitiesId)

export default amentitiesRouter

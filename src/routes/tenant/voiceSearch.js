import express from 'express'

import { tenantController } from '../../controllers/index.js'

const voiceSearchRouter = express.Router()

voiceSearchRouter.post('/synthesize', tenantController.voiceSearch.synthesize)

voiceSearchRouter.post('/transcript', tenantController.voiceSearch.transcript)

export default voiceSearchRouter

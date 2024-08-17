import express from 'express'

import { checkRole, authenticateSession } from '../../middleware/index.js'
import { landlordController } from '../../controllers/index.js'

const landlordAmentitesRouter = express.Router()

landlordAmentitesRouter.get(
    '/all-amentities',
    authenticateSession,
    checkRole.checkLandlordRole,
    landlordController.amentities.getAllAmentities,
)

export default landlordAmentitesRouter

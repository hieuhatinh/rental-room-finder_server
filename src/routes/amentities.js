import express from 'express'

import { amentitiesController } from '../controllers/index.js'
import authenticateJwt from '../middleware/authenticateJwt.js'
import { checkAdminRole, checkLanlordRole } from '../middleware/checkRole.js'

const amentitiesRouter = express.Router()

amentitiesRouter.get(
    '/get-all-by-tenant',
    amentitiesController.getAllAmentitiesTenant,
)
amentitiesRouter.get('/get-amentities-id', amentitiesController.getAmentitiesId)

// landlord, amentity
amentitiesRouter.get(
    '/all-amentities-by-landlord',
    authenticateJwt,
    checkLanlordRole,
    amentitiesController.getAllAmentityByLandlord,
)

amentitiesRouter.post(
    '/add-amentity',
    authenticateJwt,
    checkLanlordRole,
    amentitiesController.addAmentity,
)

amentitiesRouter.get(
    '/all-amentities-by-admin',
    authenticateJwt,
    checkAdminRole,
    amentitiesController.getAllAmentityByAdmin,
)

amentitiesRouter.patch(
    '/accept-amentity',
    authenticateJwt,
    checkAdminRole,
    amentitiesController.acceptAmentityByAdmin,
)

amentitiesRouter.patch(
    '/refuse-amentity',
    authenticateJwt,
    checkAdminRole,
    amentitiesController.refuseAmentityByAdmin,
)

export default amentitiesRouter

import express from 'express'
import { adminController } from '../../controllers/index.js'
import authenticateJwt from '../../middleware/authenticateJwt.js'
import { checkAdminRole } from '../../middleware/checkRole.js'

const adminManageLandlordsRouter = express.Router()

adminManageLandlordsRouter.post(
    '/add-landlord',
    authenticateJwt,
    checkAdminRole,
    adminController.manageLandlords.addNewLandlord,
)

adminManageLandlordsRouter.get(
    '/get-landlords/:page/:limit',
    authenticateJwt,
    checkAdminRole,
    adminController.manageLandlords.getLandlords,
)

adminManageLandlordsRouter.get(
    '/get-landlord-by-id/:id_landlord',
    authenticateJwt,
    checkAdminRole,
    adminController.manageLandlords.getInfoLandlord,
)

adminManageLandlordsRouter.put(
    '/update-info-landlord/:id_landlord',
    authenticateJwt,
    checkAdminRole,
    adminController.manageLandlords.updateInfoLandlord,
)

adminManageLandlordsRouter.delete(
    '/delete-landlord/:id_landlord',
    authenticateJwt,
    checkAdminRole,
    adminController.manageLandlords.deleteLandlord,
)

export default adminManageLandlordsRouter

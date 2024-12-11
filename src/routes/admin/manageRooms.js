import express from 'express'
import { adminController } from '../../controllers/index.js'
import { authenticateJwt } from '../../middleware/index.js'
import { checkAdminRole } from '../../middleware/checkRole.js'

const adminManageRoomsRouter = express.Router()

adminManageRoomsRouter.get(
    '/get-approvals-request',
    authenticateJwt,
    checkAdminRole,
    adminController.manageRooms.getRoomsUnAccepted,
)

adminManageRoomsRouter.get(
    '/get-detail-approval-request/:id_landlord/:id_room',
    authenticateJwt,
    checkAdminRole,
    adminController.manageRooms.getDetailUnacceptRoom,
)

adminManageRoomsRouter.patch(
    '/accept-request',
    authenticateJwt,
    checkAdminRole,
    adminController.manageRooms.acceptRequest,
)

adminManageRoomsRouter.patch(
    '/reject-request',
    authenticateJwt,
    checkAdminRole,
    adminController.manageRooms.rejectRequest,
)

export default adminManageRoomsRouter

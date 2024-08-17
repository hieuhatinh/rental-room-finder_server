import express from 'express'

import { checkRole, authenticateSession } from '../../middleware/index.js'
import { landlordController } from '../../controllers/index.js'

const landlordRoomRouter = express.Router()

landlordRoomRouter.get(
    '/all-room/:id_landlord',
    // authenticateSession,
    // checkRole.checkLandlordRole,
    landlordController.room.getAllRoomOfLandlord,
)

landlordRoomRouter.get(
    '/room-detail/:id_room/:id_landlord',
    // authenticateSession,
    // checkRole.checkLandlordRole,
    landlordController.room.getDetailRoomByIdLandlord,
)

landlordRoomRouter.post(
    '/room-detail/create-new-room',
    // authenticateSession,
    // checkRole.checkLandlordRole,
    landlordController.room.createNewRoom,
)

landlordRoomRouter.patch(
    '/room-detail/update-info-room',
    // authenticateSession,
    // checkRole.checkLandlordRole,
    landlordController.room.updateInfoRoom,
)

landlordRoomRouter.delete(
    '/room-detail/delete-room/:id_room/:id_landlord',
    // authenticateSession,
    // checkRole.checkLandlordRole,
    landlordController.room.deleteRoom,
)

export default landlordRoomRouter

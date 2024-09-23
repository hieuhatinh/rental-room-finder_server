import express from 'express'

import { checkRole, authenticateJwt } from '../../middleware/index.js'
import { landlordController } from '../../controllers/index.js'

const landlordRoomRouter = express.Router()

landlordRoomRouter.get(
    '/get-all-rooms',
    authenticateJwt,
    checkRole.checkLanlordRole,
    landlordController.room.getAllRoomOfLandlord,
)

landlordRoomRouter.get(
    '/room-detail/:id_room',
    authenticateJwt,
    checkRole.checkLanlordRole,
    landlordController.room.getDetailRoomByIdLandlord,
)

landlordRoomRouter.post(
    '/create-new-room',
    authenticateJwt,
    checkRole.checkLanlordRole,
    landlordController.room.createNewRoom,
)

landlordRoomRouter.patch(
    '/room-detail/update-info-room',
    // authenticateJwt,
    // checkRole.checkLandlordRole,
    landlordController.room.updateInfoRoom,
)

landlordRoomRouter.delete(
    '/delete-room/:id_room',
    authenticateJwt,
    checkRole.checkLanlordRole,
    landlordController.room.deleteRoom,
)

export default landlordRoomRouter

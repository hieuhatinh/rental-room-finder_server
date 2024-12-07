import express from 'express'

import { checkRole, authenticateJwt } from '../../middleware/index.js'
import { tenantController } from '../../controllers/index.js'

const tenantRoomsRouter = express.Router()

tenantRoomsRouter.get('/get-some-rooms', tenantController.rooms.getSomeRooms)

tenantRoomsRouter.get('/search-rooms', tenantController.rooms.searchRooms)

tenantRoomsRouter.get(
    '/get-detail-room/:id_room',
    tenantController.rooms.getDetailRoom,
)

export default tenantRoomsRouter

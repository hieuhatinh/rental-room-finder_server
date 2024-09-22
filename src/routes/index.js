import adminManageLandlordsRouter from './admin/manageLandlords.js'
import adminManageRoomsRouter from './admin/manageRooms.js'
import amentitiesRouter from './amentities.js'
import authRouter from './auth.js'
import fileRouter from './file.js'
import landlordRoomRouter from './landlord/room.js'

function routes(app) {
    app.use('/auth', authRouter)
    app.use('/file', fileRouter)
    app.use('/amentities', amentitiesRouter)

    // landlord
    app.use('/landlord/manage', landlordRoomRouter)

    // admin
    app.use('/admin/manage/landlords', adminManageLandlordsRouter)
    app.use('/admin/manage/rooms', adminManageRoomsRouter)
}

export default routes

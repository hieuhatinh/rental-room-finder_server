import adminManageLandlordsRouter from './admin/manageLandlords.js'
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
    app.use('/admin/manage', adminManageLandlordsRouter)
}

export default routes

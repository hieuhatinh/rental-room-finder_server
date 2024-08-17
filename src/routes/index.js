import authRouter from './auth.js'
import landlordAmentitesRouter from './landlord/amentities.js'
import landlordRoomRouter from './landlord/room.js'

function routes(app) {
    app.use('/auth', authRouter)
    app.use('/landlord/amentities', landlordAmentitesRouter)
    app.use('/landlord/room', landlordRoomRouter)
}

export default routes

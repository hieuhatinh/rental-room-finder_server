import adminManageLandlordsRouter from './admin/manageLandlords.js'
import adminManageRoomsRouter from './admin/manageRooms.js'
import amentitiesRouter from './amentities.js'
import authRouter from './auth.js'
import fileRouter from './file.js'
import landlordRoomRouter from './landlord/room.js'
import tenantRoomsRouter from './tenant/rooms.js'
import chatbotRouter from './chatbot.js'
import voiceSearchRouter from './tenant/voiceSearch.js'

function routes(app) {
    // tenant
    app.use('/chatbot', chatbotRouter)
    app.use('/auth', authRouter)
    app.use('/file', fileRouter)
    app.use('/amentities', amentitiesRouter)
    app.use('/tenant', tenantRoomsRouter)
    app.use('/tenant/voice-search', voiceSearchRouter)

    // landlord
    app.use('/landlord/manage', landlordRoomRouter)

    // admin
    app.use('/admin/manage/landlords', adminManageLandlordsRouter)
    app.use('/admin/manage/rooms', adminManageRoomsRouter)
}

export default routes

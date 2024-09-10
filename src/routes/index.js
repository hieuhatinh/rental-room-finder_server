import adminManageLandlordsRouter from './admin/manageLandlords.js'
import authRouter from './auth.js'
import fileRouter from './file.js'

function routes(app) {
    app.use('/auth', authRouter)
    app.use('/file', fileRouter)

    // admin
    app.use('/admin/manage', adminManageLandlordsRouter)
}

export default routes

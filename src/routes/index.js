import authRouter from './auth.js'
import fileRouter from './file.js'

function routes(app) {
    app.use('/auth', authRouter)
    app.use('/file', fileRouter)
}

export default routes

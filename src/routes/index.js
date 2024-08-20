import authRouter from "./auth.js"

function routes(app) {
    app.use('/auth', authRouter)
}

export default routes
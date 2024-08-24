import authRouter from './auth.js'
import chatbotRouter from './chatbot.js'
import roomRouter from './room.js'

function routes(app) {
    app.use('/auth', authRouter)
    app.use('/chatbot', chatbotRouter)
    app.use('/room', roomRouter)
}

export default routes

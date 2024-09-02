import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import passport from 'passport'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import passportSetup from './passport/index.js'
import routes from './routes/index.js'
import { connectionMongoDB } from './database/index.js'
import { app, server } from './socket/index.js'

dotenv.config()

// const app = express()
const port = 5000

// cors
app.use(
    cors({
        origin: 'http://localhost:3000',
        method: 'GET,POST,PUT,DELETE',
        credentials: true,
    }),
)

app.use(cookieParser())

app.use(
    session({
        name: 'session',
        secret: 'rental-room-finder',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Thay đổi maxAge nếu cần
    }),
)

// passport
app.use(passport.initialize())
app.use(passport.session())

// morgan
app.use(morgan('combined'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// error handle
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

routes(app)

// connect DB
connectionMongoDB().then(() => {
    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})

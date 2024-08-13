import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import passport from 'passport'
import cookieSession from 'cookie-session'
import cors from 'cors'
import session from 'express-session'

import passportSetup from './passport.js'
import routes from './routes/index.js'


dotenv.config()

const app = express()
const port = 5000

// cookie-session
// app.use(
//     cookieSession({
//         name: 'session',
//         keys: ['rental-room-finder'],
//         maxAge: 24*60*60*100
//     })
// )

app.use(
    session({
        name: 'session',
        secret: 'rental-room-finder',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Thay đổi maxAge nếu cần
    }),
)

// passport
app.use(passport.initialize())
app.use(passport.session())

// cors
app.use(
    cors({
        origin: 'http://localhost:3000', 
        method: 'GET,POST,PUT,DELETE',
        credentials: true
    })
)

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

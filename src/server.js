import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import routes from './routes/index.js'

dotenv.config()

const app = express()
const port = 3000

app.use(morgan('combined'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

routes(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

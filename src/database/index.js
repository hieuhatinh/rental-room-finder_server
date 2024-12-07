import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST_MYSQL,
    port: process.env.PORT_MYSQL,
    user: process.env.USER_MYSQL,
    password: process.env.PASSWORD_MYSQL,
    database: process.env.DATABASE_MYSQL,
})
const connection = await pool.getConnection()

connection.release()

async function connectionMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        connection.on('connected', () => {
            console.log('Connect to DB')
        })

        connection.on('error', (error) => {
            console.log('something is wrong in mongodb', error)
        })
    } catch (error) {
        console.log('Something is wrong', error)
    }
}

export { connection, connectionMongoDB }

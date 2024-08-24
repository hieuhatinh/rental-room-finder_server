import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

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
export { connection }

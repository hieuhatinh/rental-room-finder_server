import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const getIdFromToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.PRIVATE_KEY_JWT)
        return decoded.id
    } catch (error) {
        throw new Error('Invalid token')
    }
}

export default getIdFromToken

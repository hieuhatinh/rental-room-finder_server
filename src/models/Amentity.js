import { connection } from '../database/index.js'

async function getAllAmentities() {
    try {
        const [amentities] = await connection.query('SELECT * FROM amentities')

        return amentities
    } catch (error) {
        throw new Error('Có lỗi xảy ra')
    }
}

export default { getAllAmentities }

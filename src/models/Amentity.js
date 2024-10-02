import { connection } from '../database/index.js'

async function getAllAmentities() {
    try {
        const [amentities] = await connection.query('SELECT * FROM amentities')

        return amentities
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function getAmentitiesId({ names }) {
    try {
        names = names.map((item) => `'${item}'`).join(', ')
        const [amentitiesId] = await connection.query(
            `SELECT amentities.id_amentity FROM amentities 
            WHERE amentities.amentity_name IN (${names})`,
        )

        return amentitiesId
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

export default { getAllAmentities, getAmentitiesId }

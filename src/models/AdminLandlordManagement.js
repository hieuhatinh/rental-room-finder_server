import { connection } from '../database/index.js'
import { UserModelMySQL } from './index.js'

async function getLandlords({ limit, page, skip }) {
    try {
        const queryCount = 'SELECT COUNT(*) as total FROM landlords'
        const [numberLandlords] = await connection.execute(queryCount)

        const totalItems = numberLandlords[0].total
        const totalPages = Math.ceil(totalItems / limit)

        const queryGetLandlords = `SELECT *, TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age FROM landlords JOIN users ON landlords.id_landlord = users.id_user LIMIT ${limit} OFFSET ${skip}`
        const [landlords] = await connection.execute(queryGetLandlords)

        return {
            page,
            limit,
            totalPages,
            totalItems,
            items: landlords,
        }
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

async function getLandlordById({ id_landlord }) {
    try {
        const query =
            'SELECT *, TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age FROM landlords JOIN users ON users.id_user = landlords.id_landlord WHERE id_user = ?'
        const [infoLandlord] = await connection.execute(query, [id_landlord])

        return infoLandlord[0]
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

async function updateInfoLandlord({
    id_landlord,
    full_name,
    address_name,
    phone_number,
    birth_date,
}) {
    try {
        const queryUpdateFullName =
            'UPDATE users SET full_name=? WHERE id_user=?'
        const [updateFullName] = await connection.execute(queryUpdateFullName, [
            full_name,
            id_landlord,
        ])

        const query =
            'UPDATE landlords SET address_name=?, phone_number=?, birth_date=? WHERE id_landlord=?'
        const values = [address_name, phone_number, birth_date, id_landlord]
        const [infoLandlord] = await connection.execute(query, values)

        const [infoLandlordUpdate] = await connection.execute(
            'SELECT * FROM landlords JOIN users ON users.id_user = landlords.id_landlord WHERE id_landlord = ?',
            [id_landlord],
        )

        return infoLandlordUpdate[0]
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

async function deleteLandlord({ id_landlord }) {
    try {
        const queryDeleteLandlord = 'DELETE FROM landlords WHERE id_landlord=?'
        const [resultDeleteLandlord] = await connection.execute(
            queryDeleteLandlord,
            [id_landlord],
        )

        return resultDeleteLandlord
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

export default {
    getLandlords,
    getLandlordById,
    updateInfoLandlord,
    deleteLandlord,
}

import { connection } from '../database/index.js'

async function getAllAmentitiesTenant() {
    try {
        const [amentities] = await connection.query(`SELECT * FROM amentities 
                                                    WHERE status='approved'`)

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

// landlord, admin
async function getAllAmentityByLandlord() {
    try {
        const [amentities] =
            await connection.query(`SELECT amentities.* FROM amentities 
                                    WHERE status IN ('approved', 'pending')`)

        return amentities
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function addAmentity({ amentity, userInfo }) {
    try {
        const [existAmentity] = await connection.query(
            `SELECT * FROM amentities WHERE amentity_name =?`,
            [amentity],
        )
        if (existAmentity[0]) {
            throw new Error(
                'Tiện ích đã tồn tại. Nếu bạn không thấy tiện ích, vui lòng tải lại trang',
            )
        }
        const [newAmentity] = await connection.query(
            `INSERT INTO amentities (amentity_name, create_by) VALUES (?, ?)`,
            [amentity, userInfo.id],
        )
        return newAmentity
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function countNewAmentity() {
    try {
        const [number] = await connection.query(
            `SELECT COUNT(*) as totalItems FROM amentities WHERE status = 'pending'`,
        )
        return number[0].totalItems
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function getAllAmentityByAdmin() {
    try {
        const [amentities] =
            await connection.query(`SELECT amentities.*, users.id_user, users.full_name FROM amentities 
                                    LEFT JOIN users on users.id_user = amentities.create_by`)

        return amentities
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function acceptAmentityByAdmin({ userInfo, id_amentity }) {
    try {
        const [update] = await connection.query(
            `UPDATE amentities 
            SET status='approved', accept_by=?
            WHERE id_amentity=?`,
            [userInfo.id, id_amentity],
        )

        return update
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function refuseAmentityByAdmin({ userInfo, id_amentity }) {
    try {
        const [update] = await connection.query(
            `UPDATE amentities
            SET status='rejected', accept_by=?
            WHERE id_amentity=?`,
            [userInfo.id, id_amentity],
        )

        const [deleteRoomAmentity] = await connection.query(
            `DELETE FROM room_amentities WHERE id_amentity=?`,
            [id_amentity],
        )

        return { update }
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function findLandlordRelatedAmentity({ amentity }) {
    try {
        const [idLandlords] = await connection.query(
            `SELECT amentities.create_by, rooms.id_landlord FROM rooms
            JOIN room_amentities on room_amentities.id_room = rooms.id_room
            JOIN amentities on amentities.id_amentity = room_amentities.id_amentity
            WHERE amentities.id_amentity=?`,
            [amentity.id_amentity],
        )

        console.log(idLandlords)

        let result = []

        idLandlords.forEach(
            (item) =>
                (result = result.concat([item.id_landlord, item.create_by])),
        )

        result = [...new Set(result)]

        return result
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

async function findAndDeleteRelatedAmentity({ amentity }) {
    try {
        const [idLandlords] = await connection.query(
            `select amentities.create_by, rooms.id_landlord from amentities
            LEFT JOIN room_amentities on room_amentities.id_amentity = amentities.id_amentity
            LEFT JOIN rooms on rooms.id_room = room_amentities.id_room
            WHERE amentities.id_amentity=?`,
            [amentity.id_amentity],
        )

        let result = []

        idLandlords.forEach(
            (item) =>
                (result = result.concat([item.id_landlord, item.create_by])),
        )

        result = [...new Set(result)]

        return result
    } catch (error) {
        throw new Error(error.message || 'Có lỗi xảy ra')
    }
}

export default {
    getAllAmentitiesTenant,
    getAmentitiesId,
    getAllAmentityByLandlord,
    addAmentity,
    countNewAmentity,
    getAllAmentityByAdmin,
    acceptAmentityByAdmin,
    refuseAmentityByAdmin,
    findLandlordRelatedAmentity,
    findAndDeleteRelatedAmentity,
}

import { connection } from '../database/index.js'

async function getAllRoomTypes() {
    try {
        const [roomTypes] = await connection.query('SELECT * FROM room_types')

        return roomTypes
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getAllRooms() {
    // try {
    // } catch (error) {
    //     throw new Error('Có lỗi xảy ra')
    // }
}

// landlord
async function findRoomInDB({ id_landlord, id_room }) {
    try {
        const query = 'SELECT * FROM rooms WHERE id_landlord=? and id_room=?'
        const [exisRoom] = await connection.execute(query, [
            id_landlord,
            id_room,
        ])

        return exisRoom
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getRoomsByIdLandlord({ id_landlord, page, skip, limit }) {
    try {
        const [result] = await connection.execute(
            `SELECT COUNT(*) as total FROM rooms WHERE id_landlord=?`,
            [id_landlord],
        )
        const totalItems = result[0].total
        const totalPages = Math.ceil(totalItems / limit)

        const query = `SELECT * FROM rooms WHERE id_landlord=? 
                        LIMIT ${limit} OFFSET ${skip}`
        const [roomsOfLandlord] = await connection.execute(query, [id_landlord])

        return {
            items: roomsOfLandlord,
            limit,
            totalItems,
            totalPages,
            page,
            limit,
        }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getDetailRoomByIdLandlord({ id_landlord, id_room }) {
    try {
        const query = 'call get_detail_room_by_landlord(?, ?)'
        const [info] = await connection.execute(query, [id_landlord, id_room])

        const queryGetImgsOfRoom = `SELECT * from room_images
                                    WHERE room_images.id_room =?`
        const [imagesOfRoom] = await connection.execute(queryGetImgsOfRoom, [
            id_room,
        ])

        return { ...info[0][0], imagesOfRoom }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getReviewsOfRoomByLandlord({ id_landlord, id_room }) {
    try {
        const query = 'call get_reviews_of_room_by_landlord(?, ?)'
        const [reviewsOfRoom] = await connection.execute(query, [
            id_landlord,
            id_room,
        ])

        return reviewsOfRoom
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function createNewRoom({
    id_landlord,
    title,
    address_name,
    latitude,
    longitude,
    capacity,
    price,
    electricity_price,
    water_price,
    room_area,
    description,
    images,
    amentities,
}) {
    try {
        const query =
            'insert into rooms (id_landlord, title, address_name, ' +
            'latitude, longitude, capacity, price, electricity_price, ' +
            'water_price, room_area, description) ' +
            ' values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const values = [
            id_landlord,
            title,
            address_name,
            latitude,
            longitude,
            capacity,
            price,
            electricity_price,
            water_price,
            room_area,
            description,
        ]
        const [newRoom] = await connection.execute(query, values)
        let id_room = newRoom.insertId

        // add images
        for (let image of images) {
            const queryInsertImages =
                'INSERT INTO room_images (id_image, id_room, image_url, image_type, image_name) VALUES (?, ?, ?, ?, ?)'
            await connection.execute(queryInsertImages, [
                image.public_id,
                id_room,
                image.url,
                image.type,
                image.name,
            ])
        }

        // add amentities
        for (let amentityId of amentities) {
            const queryInsertAmentity =
                'INSERT INTO room_amentities (id_room, id_amentity) VALUES (?, ?)'
            await connection.execute(queryInsertAmentity, [id_room, amentityId])
        }

        return id_room
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

// hàm updateInfoRoom cần update thông tin trong bảng rooms,
// ngoài ra còn update images, amentities
async function updateInfoRoom() {}

async function deleteRoom({ id_landlord, id_room }) {
    try {
        const query = 'DELETE FROM rooms WHERE id_landlord=? and id_room=?'
        const [result] = await connection.execute(query, [id_landlord, id_room])

        return result
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

// admin
async function findAllUnacceptedRooms({ page, skip, limit }) {
    try {
        const totalItems = await countUnacceptedRooms()
        const totalPages = Math.ceil(totalItems / limit)

        const query = `SELECT rooms.id_room, rooms.title, rooms.id_landlord,
                            landlords.profile_img, 
                            users.full_name,
                            rooms.address_name as address_room
                       FROM rooms 
               JOIN landlords ON landlords.id_landlord = rooms.id_landlord 
               JOIN users ON users.id_user = landlords.id_landlord 
               WHERE rooms.is_accept = ? 
               LIMIT ${limit} OFFSET ${skip}`
        const [unacceptRooms] = await connection.execute(query, [0])
        return { unacceptRooms, page, limit, totalPages, totalItems }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function countUnacceptedRooms() {
    try {
        const query =
            'SELECT COUNT(*) as numberOfRecords FROM rooms WHERE is_accept=?'
        const [numberOfRecords] = await connection.execute(query, [0])
        return numberOfRecords[0].numberOfRecords
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getDetailUnacceptRoom({ id_landlord, id_room }) {
    try {
        const [statusAcceptOfRoom] = await connection.execute(
            `SELECT is_accept FROM rooms
                                    WHERE id_room=? AND id_landlord=?`,
            [id_room, id_landlord],
        )

        if (statusAcceptOfRoom[0]?.is_accept) {
            return statusAcceptOfRoom[0]
        }

        const query = `SELECT rooms.*, rooms.address_name as address_room, 
                                landlords.*, users.full_name, users.gender,
                                landlords.address_name as address_landlord,
                                TIMESTAMPDIFF(YEAR, landlords.birth_date, CURDATE()) AS age,
                                GROUP_CONCAT(DISTINCT amentities.amentity_name) AS amentities,
                                GROUP_CONCAT(DISTINCT room_images.image_url) AS images
                           FROM rooms 
                   JOIN landlords ON landlords.id_landlord = rooms.id_landlord 
                   JOIN users ON users.id_user = landlords.id_landlord 
                   JOIN room_amentities ON room_amentities.id_room = rooms.id_room
                   JOIN amentities ON amentities.id_amentity = room_amentities.id_amentity
                   JOIN room_images ON room_images.id_room = rooms.id_room
                   WHERE rooms.is_accept = ? AND rooms.id_room = ? AND rooms.id_landlord = ?
                   GROUP BY rooms.id_room, landlords.id_landlord`
        const [detailUnacceptRoom] = await connection.execute(query, [
            0,
            id_room,
            id_landlord,
        ])

        return detailUnacceptRoom[0]
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function updateStatusAccept({
    id_landlord,
    id_room,
    id_admin,
    is_accept,
}) {
    try {
        const query = `UPDATE rooms
                        SET accept_by=?, is_accept=?, accept_at=CURRENT_TIMESTAMP
                        WHERE rooms.id_room=? AND rooms.id_landlord=?`

        const [result] = await connection.execute(query, [
            id_admin,
            is_accept,
            id_room,
            id_landlord,
        ])

        return result
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

export default {
    getAllRoomTypes,
    getAllRooms,
    findRoomInDB,
    // landlord
    getRoomsByIdLandlord,
    getDetailRoomByIdLandlord,
    getReviewsOfRoomByLandlord,
    createNewRoom,
    updateInfoRoom,
    deleteRoom,
    // admin
    findAllUnacceptedRooms,
    countUnacceptedRooms,
    getDetailUnacceptRoom,
    updateStatusAccept,
}

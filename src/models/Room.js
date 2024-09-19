import { connection } from '../database/index.js'

async function getAllRoomTypes() {
    try {
        const [roomTypes] = await connection.query('SELECT * FROM room_types')

        return roomTypes
    } catch (error) {
        throw new Error('Có lỗi xảy ra')
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
        throw new Error('Có lỗi xảy ra')
    }
}

async function getRoomsByIdLandlord(id_landlord) {
    try {
        const query = 'SELECT * FROM rooms WHERE id_landlord=?'
        const [roomsOfLandlord] = await connection.execute(query, [id_landlord])

        return roomsOfLandlord
    } catch (error) {
        throw new Error('Có lỗi xảy ra')
    }
}

async function getDetailRoomByIdLandlord({ id_landlord, id_room }) {
    try {
        const query = 'call get_detail_room_by_landlord(?, ?)'
        const [info] = await connection.execute(query, [id_landlord, id_room])

        return info[0][0]
    } catch (error) {
        throw new Error('Có lỗi xảy ra')
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
        throw new Error('Có lỗi xảy ra')
    }
}

// hàm createNewRoom còn thiêú phần lưu ảnh, amentities
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

        return newRoom
    } catch (error) {
        throw new Error('Có lỗi xảy ra')
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
        throw new Error('Có lỗi xảy ra')
    }
}

export default {
    getAllRoomTypes,
    getAllRooms,
    findRoomInDB,
    getRoomsByIdLandlord,
    getDetailRoomByIdLandlord,
    getReviewsOfRoomByLandlord,
    createNewRoom,
    updateInfoRoom,
    deleteRoom,
}

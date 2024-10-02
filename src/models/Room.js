import { connection } from '../database/index.js'

// tenant
async function getSomeRooms() {
    try {
        const query = `select distinct * from rooms
                        JOIN room_images on room_images.id_room = rooms.id_room
                        JOIN (
                            SELECT id_room, MIN(id_image) as id_image FROM room_images
                            GROUP BY id_room
                        ) as image on image.id_image = room_images.id_image
                        JOIN landlords ON landlords.id_landlord = rooms.id_landlord
                        WHERE rooms.is_accept = 1
                        ORDER BY rooms.price
                        LIMIT 20`

        const [someRooms] = await connection.execute(query)

        return someRooms
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function searchRooms({
    display_name,
    lat,
    lon,
    radius = 5,
    page,
    limit,
    skip,
    capacity = null,
    amentities = null,
    roomPrice = null,
    waterPrice = null,
    electricityPrice = null,
}) {
    try {
        radius = radius * 1000

        let querySearch = `SELECT DISTINCT rooms.*, landlords.phone_number, room_images.*, 
                                ST_Distance_Sphere(location, ST_SRID(Point(${+lon}, ${+lat}), 4326)) AS distance,
                                group_concat(concat(amentities.id_amentity, ":", amentities.amentity_name) separator ',') as list_amentity
                            FROM rooms
                            JOIN landlords ON landlords.id_landlord = rooms.id_landlord
                            JOIN room_images ON room_images.id_room = rooms.id_room
                            JOIN (
                                SELECT id_room, MIN(id_image) as id_image FROM room_images
                                GROUP BY id_room
                            ) as image on image.id_image = room_images.id_image
                            JOIN room_amentities ON room_amentities.id_room = rooms.id_room
                            JOIN amentities ON amentities.id_amentity = room_amentities.id_amentity
                            WHERE ST_Distance_Sphere(location, ST_SRID(Point(${+lon}, ${+lat}), 4326)) < ${radius} 
                                    AND rooms.is_accept = 1
                            `

        let conditions = []
        if (amentities) {
            conditions.push(
                `rooms.id_room in (
                    SELECT room_amentities.id_room from rooms
					JOIN room_amentities on room_amentities.id_room = rooms.id_room
					WHERE room_amentities.id_amentity IN (${amentities.join(',')})
					GROUP BY room_amentities.id_room)`,
            )
        }
        if (roomPrice) {
            conditions.push(`rooms.price <= ${+roomPrice}`)
        }
        if (waterPrice) {
            conditions.push(`rooms.water_price <= ${+waterPrice}`)
        }
        if (electricityPrice) {
            conditions.push(`rooms.electricity_price <= ${+electricityPrice}`)
        }
        if (capacity) {
            conditions.push(`rooms.capacity >= ${+capacity}`)
        }

        if (conditions.length > 0) {
            querySearch += ` AND (` + conditions.join('\n OR ') + ')'
        }

        querySearch += ` \n GROUP BY rooms.id_room, room_images.id_image
                        ORDER BY distance ASC, rooms.price ASC`

        // truy vấn đếm tổng số bản ghi thỏa mãn
        const [countResult] = await connection.execute(querySearch)
        const totalItems = countResult.length
        const totalPages = Math.ceil(totalItems / +limit)

        // truy vấn lấy kết quả
        querySearch += ` \n LIMIT ${+limit} OFFSET ${skip}`
        const [rooms] = await connection.execute(querySearch)

        return {
            items: rooms,
            totalItems,
            totalPages,
            page: +page,
            limit: +limit,
        }
    } catch (error) {
        console.log(error)
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getDetailRoom({ id_room }) {
    try {
        const query = `SELECT landlords.phone_number, rooms.* FROM rooms  
                        JOIN landlords ON landlords.id_landlord = rooms.id_landlord
                        WHERE rooms.is_accept = 1 AND rooms.id_room = ?`
        const [infoRoom] = await connection.execute(query, [id_room])

        const [imagesRoom] = await connection.execute(
            `SELECT * FROM room_images
            WHERE room_images.id_room = ?`,
            [id_room],
        )

        const [amentitiesRoom] = await connection.execute(
            `SELECT amentities.id_amentity, amentities.amentity_name FROM room_amentities
            JOIN amentities ON amentities.id_amentity = room_amentities.id_amentity
            WHERE room_amentities.id_room=?`,
            [id_room],
        )

        return { infoRoom: infoRoom[0], imagesRoom, amentitiesRoom }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
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
        const query = `SELECT * FROM rooms WHERE id_landlord=? 
                        LIMIT ${limit} OFFSET ${skip}`
        const [roomsOfLandlord] = await connection.execute(query, [id_landlord])

        const totalItems = roomsOfLandlord.length
        const totalPages = Math.ceil(totalItems / limit)

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
        const query = `INSERT INTO rooms (id_landlord, title, address_name, 
                        location, capacity, price, electricity_price, 
                        water_price, room_area, description) 
            VALUES (?, ?, ?, ST_SRID(Point(?, ?), 4326), ?, ?, ?, ?, ?, ?)`
        const values = [
            id_landlord,
            title,
            address_name,
            +longitude,
            +latitude,
            +capacity,
            +price,
            +electricity_price,
            +water_price,
            +room_area,
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
                                GROUP_CONCAT(DISTINCT amentities.amentity_name) AS amentities
                           FROM rooms 
                   JOIN landlords ON landlords.id_landlord = rooms.id_landlord 
                   JOIN users ON users.id_user = landlords.id_landlord 
                   JOIN room_amentities ON room_amentities.id_room = rooms.id_room
                   JOIN amentities ON amentities.id_amentity = room_amentities.id_amentity
                   WHERE rooms.is_accept = ? AND rooms.id_room = ? AND rooms.id_landlord = ?
                   GROUP BY rooms.id_room, landlords.id_landlord`
        const [detailUnacceptRoom] = await connection.execute(query, [
            0,
            id_room,
            id_landlord,
        ])

        const [images] = await connection.execute(
            `SELECT room_images.* FROM room_images 
                                    JOIN rooms ON rooms.id_room = room_images.id_room
                                    WHERE rooms.is_accept = ? AND rooms.id_room = ? AND rooms.id_landlord = ?`,
            [0, id_room, id_landlord],
        )

        console.log(images)

        return {
            ...detailUnacceptRoom[0],
            images,
        }
    } catch (error) {
        console.log(error)
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
    // tenant
    getSomeRooms,
    searchRooms,
    getDetailRoom,
    // landlord
    findRoomInDB,
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

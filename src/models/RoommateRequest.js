import { connection } from '../database/index.js'

async function createNewRequest(values) {
    try {
        const query = `
                        INSERT INTO roommate_request (id_tenant, title, address_name, location, gender, description, price, quantity)
                        VALUES (?, ?, ?, ST_SRID(Point(?, ?), 4326), ?, ?, ?, ?)
                    `

        const [newRequest] = await connection.execute(query, [
            values.id_tenant,
            values.title,
            values.address,
            +values.lon,
            +values.lat,
            +values.gender,
            values.description || null,
            +values.price,
            +values.quantity,
        ])
        let id_request = newRequest.insertId

        // add images
        if (values?.images) {
            for (let image of values.images) {
                const queryInsertImages =
                    'INSERT INTO room_images (id_image, id_request, image_url, image_type, image_name) VALUES (?, ?, ?, ?, ?)'
                await connection.execute(queryInsertImages, [
                    image.public_id,
                    id_room,
                    image.url,
                    image.type,
                    image.name,
                ])
            }
        }

        // add habits
        const habits = values.habits.map((habit_name) => {
            return [id_request, habit_name]
        })
        const habitsQuery = `INSERT INTO roommate_habits (id_request, habit_name) VALUES ?`
        await connection.query(habitsQuery, [habits])

        // add hobbies
        const hobbies = values.hobbies.map((hobby_name) => {
            return [id_request, hobby_name]
        })
        const hobbiesQuery = `INSERT INTO roommate_hobbies (id_request, hobby_name) VALUES ?`
        await connection.query(hobbiesQuery, [hobbies])

        // add amentities
        const amentities = values.amentities.map((id_amentity) => {
            return [id_request, id_amentity]
        })
        const amentitiesQuery = `INSERT INTO roommate_request_amentities (id_request, id_amentity) VALUES ?`
        await connection.query(amentitiesQuery, [amentities])

        return newRequest
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getHobbies() {
    try {
        const [uniqueHobbies] = await connection.execute(
            `SELECT 
                JSON_ARRAYAGG(roommate_hobbies.hobby_name) AS unique_hobbies 
             FROM roommate_hobbies`,
        )
        return uniqueHobbies[0]
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getHabits() {
    try {
        const [uniqueHabits] = await connection.execute(
            `SELECT 
                JSON_ARRAYAGG(roommate_habits.habit_name) AS unique_habits 
             FROM roommate_habits`,
        )
        return uniqueHabits[0]
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getMaxMinRoomPrice() {
    let query = `SELECT 
                    MAX(price) as maxPrice, 
                    MIN(price) as minPrice
                 FROM roommate_request`
    const [result] = await connection.execute(query)
    return result[0]
}

async function searchWithGenderAndLocation({
    lat,
    lon,
    gender,
    radius = 5,
    id_tenant,
    page,
    limit,
    skip,
}) {
    try {
        radius = radius * 1000
        let querySearch = `SELECT DISTINCT 
                                rr.*, 
                                users.username, 
                                users.avatar, 
                                users.full_name, 
                                users.gender AS user_gender,
                                JSON_ARRAYAGG(JSON_OBJECT('amentity_id', amentities.id_amentity, 'amentity_name', amentities.amentity_name)) AS amentities,
                                (SELECT JSON_ARRAYAGG(roommate_hobbies.hobby_name) 
                                    FROM roommate_hobbies 
                                    WHERE roommate_hobbies.id_request = rr.id) AS hobbies,
                                (SELECT JSON_ARRAYAGG(roommate_habits.habit_name)
                                    FROM roommate_habits 
                                    WHERE roommate_habits.id_request = rr.id) AS habits,
                                CASE
                                    WHEN EXISTS (SELECT 1 FROM roommate_request_images ri WHERE ri.id_request = rr.id)
                                    THEN JSON_ARRAYAGG(JSON_OBJECT('image_url', ri.image_url, 'image_type', ri.image_type, 'image_name', ri.image_name))
                                    ELSE NULL
                                END AS images,
                                ST_Distance_Sphere(location, ST_SRID(Point(${+lon}, ${+lat}), 4326)) AS distance
                            FROM 
                                roommate_request rr
                            JOIN 
                                users ON users.id_user = rr.id_tenant
                            JOIN 
                                roommate_request_amentities ra ON ra.id_request = rr.id
                            JOIN 
                                amentities ON amentities.id_amentity = ra.id_amentity
                            LEFT JOIN 
                                roommate_request_images ri ON rr.id = ri.id_request
                            WHERE 
                                rr.id_tenant <> ?
                                AND rr.gender = ${gender}
                                AND ST_Distance_Sphere(location, ST_SRID(Point(${+lon}, ${+lat}), 4326)) < ${radius}
                            GROUP BY 
                                rr.id
                            ORDER BY 
                                rr.created_at DESC`

        // truy vấn đếm tổng số bản ghi thỏa mãn
        const [countResult] = await connection.execute(querySearch, [id_tenant])
        const totalItems = countResult.length
        const totalPages = Math.ceil(totalItems / +limit)

        // truy vấn lấy kết quả
        querySearch += ` \n LIMIT ${+limit} OFFSET ${skip}`

        const [results] = await connection.execute(querySearch, [id_tenant])
        return {
            items: results,
            totalItems,
            totalPages,
            page: +page,
            limit: +limit,
        }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getAll({ id_tenant, page, limit, skip }) {
    try {
        let querySearch = `SELECT
                                rr.*, 
                                users.username, 
                                users.avatar, 
                                users.full_name, 
                                users.gender AS user_gender,
                                JSON_ARRAYAGG(JSON_OBJECT('amentity_id', amentities.id_amentity, 'amentity_name', amentities.amentity_name)) AS amentities,
                                (SELECT JSON_ARRAYAGG(roommate_hobbies.hobby_name) 
                                    FROM roommate_hobbies 
                                    WHERE roommate_hobbies.id_request = rr.id) AS hobbies,
                                (SELECT JSON_ARRAYAGG(roommate_habits.habit_name)
                                    FROM roommate_habits 
                                    WHERE roommate_habits.id_request = rr.id) AS habits,
                                CASE
                                    WHEN EXISTS (SELECT 1 FROM roommate_request_images ri WHERE ri.id_request = rr.id)
                                    THEN JSON_ARRAYAGG(JSON_OBJECT('image_url', ri.image_url, 'image_type', ri.image_type, 'image_name', ri.image_name))
                                    ELSE NULL
                                END AS images
                            FROM 
                                roommate_request rr
                            JOIN 
                                users ON users.id_user = rr.id_tenant
                            JOIN 
                                roommate_request_amentities ra ON ra.id_request = rr.id
                            JOIN 
                                amentities ON amentities.id_amentity = ra.id_amentity
                            LEFT JOIN 
                                roommate_request_images ri ON rr.id = ri.id_request
                            WHERE 
                                rr.id_tenant <> ?
                            GROUP BY 
                                rr.id
                            ORDER BY 
                                rr.created_at DESC`

        // truy vấn đếm tổng số bản ghi thỏa mãn
        const [countResult] = await connection.execute(querySearch, [id_tenant])
        const totalItems = countResult.length
        const totalPages = Math.ceil(totalItems / +limit)

        // truy vấn lấy kết quả
        querySearch += ` \n LIMIT ${+limit} OFFSET ${skip}`

        const [results] = await connection.execute(querySearch, [id_tenant])
        return {
            items: results,
            totalItems,
            totalPages,
            page: +page,
            limit: +limit,
        }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getMyPosts({ id_tenant, page, limit, skip }) {
    try {
        let querySearch = `SELECT DISTINCT 
                                rr.*, 
                                users.username, 
                                users.avatar, 
                                users.full_name, 
                                users.gender AS user_gender,
                                JSON_ARRAYAGG(JSON_OBJECT('amentity_id', amentities.id_amentity, 'amentity_name', amentities.amentity_name)) AS amentities,
                                (SELECT JSON_ARRAYAGG(roommate_hobbies.hobby_name)
                                    FROM roommate_hobbies 
                                    WHERE roommate_hobbies.id_request = rr.id) AS hobbies,
                                (SELECT JSON_ARRAYAGG(roommate_habits.habit_name)
                                    FROM roommate_habits 
                                    WHERE roommate_habits.id_request = rr.id) AS habits,
                                CASE
                                    WHEN EXISTS (SELECT 1 FROM roommate_request_images ri WHERE ri.id_request = rr.id)
                                    THEN JSON_ARRAYAGG(JSON_OBJECT('image_url', ri.image_url, 'image_type', ri.image_type, 'image_name', ri.image_name))
                                    ELSE NULL
                                END AS images
                            FROM 
                                roommate_request rr
                            JOIN 
                                users ON users.id_user = rr.id_tenant
                            JOIN 
                                roommate_request_amentities ra ON ra.id_request = rr.id
                            JOIN 
                                amentities ON amentities.id_amentity = ra.id_amentity
                            LEFT JOIN 
                                roommate_request_images ri ON rr.id = ri.id_request
                            WHERE 
                                rr.id_tenant = ?
                            GROUP BY 
                                rr.id
                            ORDER BY 
                                rr.created_at DESC`

        // truy vấn đếm tổng số bản ghi thỏa mãn
        const [countResult] = await connection.execute(querySearch, [id_tenant])
        const totalItems = countResult.length
        const totalPages = Math.ceil(totalItems / +limit)

        // truy vấn lấy kết quả
        querySearch += ` \n LIMIT ${+limit} OFFSET ${skip}`

        const [results] = await connection.execute(querySearch, [id_tenant])
        return {
            items: results,
            totalItems,
            totalPages,
            page: +page,
            limit: +limit,
        }
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function deletePost({ id_room }) {
    try {
        const [result] = await connection.execute(
            `DELETE FROM roommate_request WHERE id=?`,
            [id_room],
        )

        return result
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

export default {
    createNewRequest,
    getHobbies,
    getHabits,
    searchWithGenderAndLocation,
    getAll,
    getMyPosts,
    deletePost,
    getMaxMinRoomPrice,
}

import { connection } from '../database/index.js'

async function createNewRequest(values) {
    try {
        const query = `
                        INSERT INTO roommate_request (id_tenant, title, address_name, location, gender, description, price, quantity, habits, hobbies)
                        VALUES (?, ?, ?, ST_SRID(Point(?, ?), 4326), ?, ?, ?, ?, ?, ?)
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
            values.habits,
            values.hobbies,
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
        const [hobbies] = await connection.execute(
            `SELECT DISTINCT hobbies FROM roommate_request`,
        )
        let uniqueHobbies = []
        hobbies.forEach((element) => {
            let hobbiesElement = element.hobbies.split(', ')
            uniqueHobbies.push(...hobbiesElement)
        })
        uniqueHobbies = [...new Set(uniqueHobbies)]
        return uniqueHobbies
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function getHabits() {
    try {
        const [habits] = await connection.execute(
            `SELECT DISTINCT habits FROM roommate_request`,
        )
        let uniqueHabits = []
        habits.forEach((element) => {
            let habitsElement = element.habits.split(', ')
            uniqueHabits.push(...habitsElement)
        })
        uniqueHabits = [...new Set(uniqueHabits)]
        return uniqueHabits
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

async function searchWithGenderAndLocation({
    lat,
    lon,
    gender,
    amentities,
    radius = 5,
    id_tenant,
    page,
    limit,
    skip,
}) {
    try {
        radius = radius * 1000
        let querySearch = `SELECT distinct rr.*, users.username, users.avatar, users.full_name, users.gender as user_gender,
                                    JSON_ARRAYAGG(JSON_OBJECT('amentity_id', amentities.id_amentity, 'amentity_name', amentities.amentity_name)) AS amentities,
                                    CASE
                                        WHEN EXISTS (SELECT 1 FROM roommate_request_images ri WHERE ri.id_request = rr.id)
                                        THEN JSON_ARRAYAGG(JSON_OBJECT('image_url', ri.image_url, 'image_type', ri.image_type, 'image_name', ri.image_name))
                                        ELSE NULL
                                    END AS images,
                                    ST_Distance_Sphere(location, ST_SRID(Point(${+lon}, ${+lat}), 4326)) AS distance
                            FROM roommate_request rr
                            JOIN users on users.id_user = rr.id_tenant
                            JOIN roommate_request_amentities ra on ra.id_request = rr.id
                            JOIN amentities on amentities.id_amentity = ra.id_amentity
                            LEFT JOIN roommate_request_images ri on rr.id = ri.id_request
                            WHERE
                                rr.id_tenant <> ?
                                AND rr.gender = ${gender}
                                AND ST_Distance_Sphere(location, ST_SRID(Point(${+lon}, ${+lat}), 4326)) < ${radius}
                                AND ra.id_amentity IN (${amentities.join(',')})
                            GROUP BY rr.id`

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
        let querySearch = `SELECT distinct rr.*, users.username, users.avatar, users.full_name, users.gender as user_gender,
                                    JSON_ARRAYAGG(JSON_OBJECT('amentity_id', amentities.id_amentity, 'amentity_name', amentities.amentity_name)) AS amentities,
                                    CASE
                                        WHEN EXISTS (SELECT 1 FROM roommate_request_images ri WHERE ri.id_request = rr.id)
                                        THEN JSON_ARRAYAGG(JSON_OBJECT('image_url', ri.image_url, 'image_type', ri.image_type, 'image_name', ri.image_name))
                                        ELSE NULL
                                    END AS images
                            FROM roommate_request rr
                            JOIN users on users.id_user = rr.id_tenant
                            JOIN roommate_request_amentities ra on ra.id_request = rr.id
                            JOIN amentities on amentities.id_amentity = ra.id_amentity
                            LEFT JOIN roommate_request_images ri on rr.id = ri.id_request
                            WHERE rr.id_tenant <> ?
                            GROUP BY rr.id 
                            ORDER BY rr.created_at DESC`

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
        let querySearch = `SELECT distinct rr.*, users.username, users.avatar, users.full_name, users.gender as user_gender,
                                    JSON_ARRAYAGG(JSON_OBJECT('amentity_id', amentities.id_amentity, 'amentity_name', amentities.amentity_name)) AS amentities,
                                    CASE
                                        WHEN EXISTS (SELECT 1 FROM roommate_request_images ri WHERE ri.id_request = rr.id)
                                        THEN JSON_ARRAYAGG(JSON_OBJECT('image_url', ri.image_url, 'image_type', ri.image_type, 'image_name', ri.image_name))
                                        ELSE NULL
                                    END AS images
                            FROM roommate_request rr
                            JOIN users on users.id_user = rr.id_tenant
                            JOIN roommate_request_amentities ra on ra.id_request = rr.id
                            JOIN amentities on amentities.id_amentity = ra.id_amentity
                            LEFT JOIN roommate_request_images ri on rr.id = ri.id_request
                            WHERE rr.id_tenant = ?
                            GROUP BY rr.id
                            ORDER BY rr.created_at DESC`

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
}

import { Room } from '../../models/index.js'
import skip from '../../utils/skip.js'

const getRoomsUnAccepted = async ({ page, limit }) => {
    const result = await Room.findAllUnacceptedRooms({
        page,
        skip: skip({ page, limit }),
        limit,
    })

    return result
}

const getDetailUnacceptRoom = async ({ id_landlord, id_room }) => {
    let result = await Room.getDetailUnacceptRoom({ id_landlord, id_room })

    if (result.is_accept) {
        return {}
    }

    result = {
        roomInfo: {
            id_room: result.id_room,
            id_landlord: result.id_landlord,
            title: result.title,
            address_room: result.address_room,
            latitude: result.latitude,
            longitude: result.longitude,
            capacity: result.capacity,
            price: result.price,
            electricity_price: result.electricity_price,
            water_price: result.water_price,
            room_area: result.room_area,
            description: result.description,
            accept_by: result.accept_by,
            is_accept: result.is_accept,
            created_at: result.created_at,
            accept_at: result.accept_at,
            amentities: result.amentities.split(','),
            images: result.images.split(','),
        },
        landlordInfo: {
            id_landlord: result.id_landlord,
            profile_img: result.profile_img,
            age: result.age,
            phone_number: result.phone_number,
            address_landlord: result.address_landlord,
            full_name: result.full_name,
            gender: result.gender,
        },
    }

    return result
}

const acceptRequest = async ({ id_landlord, id_room, id_admin }) => {
    const result = await Room.updateStatusAccept({
        id_landlord,
        id_room,
        id_admin,
        is_accept: 1,
    })

    return result
}

export default { getRoomsUnAccepted, getDetailUnacceptRoom, acceptRequest }

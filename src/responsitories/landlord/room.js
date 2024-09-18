import { Room } from '../../models/index.js'

const getAllRoomOfLandlord = async ({ id_landlord }) => {
    return await Room.getRoomsByIdLandlord(id_landlord)
}

const getDetailRoomByIdLandlord = async ({ id_landlord, id_room }) => {
    let room_info = await Room.getDetailRoomByIdLandlord({
        id_landlord,
        id_room,
    })

    room_info = {
        ...room_info,
        list_amentity: room_info.list_amentity.split(',').map((item) => {
            const [id_amentity, amentity_name] = item.split(':')
            return { id_amentity, amentity_name }
        }),
    }
    return room_info
}

const createNewRoom = async (inforRoom) => {
    return await Room.createNewRoom({ ...inforRoom })
}

const updateInfoRoom = async ({ ...inforRoom }) => {
    const existRoom = await Room.findRoomInDB({ id_landlord, id_room })

    if (!existRoom) {
        throw new Error('Thông tin phòng này không tồn tại')
    }

    return await Room.updateInfoRoom({ ...inforRoom })
}

const deleteRoom = async ({ id_landlord, id_room }) => {
    const existRoom = await Room.findRoomInDB({ id_landlord, id_room })

    if (!existRoom) {
        throw new Error('Thông tin phòng này không tồn tại')
    }

    return await Room.deleteRoom({ id_landlord, id_room })
}

export default {
    getAllRoomOfLandlord,
    getDetailRoomByIdLandlord,
    createNewRoom,
    updateInfoRoom,
    deleteRoom,
}

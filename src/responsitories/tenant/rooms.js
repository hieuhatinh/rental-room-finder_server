import { Room } from '../../models/index.js'

const getSomeRooms = async () => {
    return await Room.getSomeRooms()
}

const searchRooms = async ({ display_name, lat, lon, limit, page, skip }) => {
    let result = await Room.searchRooms({
        display_name,
        lat,
        lon,
        page,
        limit,
        skip,
    })
    result = {
        ...result,
        items: result.items.map((item) => {
            return {
                ...item,
                list_amentity: item.list_amentity.split(',').map((item) => {
                    const [id_amentity, amentity_name] = item.split(':')
                    return { id_amentity, amentity_name }
                }),
            }
        }),
    }

    return result
}

const getDetailRoom = async ({ id_room }) => {
    let result = await Room.getDetailRoom({
        id_room,
    })

    return result
}

export default { getSomeRooms, searchRooms, getDetailRoom }

import { Room } from '../../models/index.js'

const getSomeRooms = async () => {
    return await Room.getSomeRooms()
}

const searchRooms = async ({
    display_name,
    lat,
    lon,
    limit,
    page,
    skip,
    radius,
    amentities,
    roomPrice,
    waterPrice,
    electricityPrice,
    capacity,
}) => {
    try {
        let newAmentities = null
        if (amentities) {
            newAmentities = amentities?.split(',')
            newAmentities = newAmentities?.map((item) => item)
        }

        let result = await Room.searchRooms({
            display_name,
            lat,
            lon,
            page,
            limit,
            skip,
            radius,
            amentities: newAmentities,
            roomPrice,
            waterPrice,
            electricityPrice,
            capacity,
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
    } catch (error) {
        throw new Error(error.message)
    }
}

const getDetailRoom = async ({ id_room }) => {
    let result = await Room.getDetailRoom({
        id_room,
    })

    return result
}

export default {
    getSomeRooms,
    searchRooms,
    getDetailRoom,
}

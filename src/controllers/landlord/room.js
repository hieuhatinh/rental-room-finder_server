import { landlordResponsitories } from '../../responsitories/index.js'

const getAllRoomOfLandlord = async (req, res) => {
    try {
        // const id_landlord = req.user.id_landlord
        const id_landlord = req.params.id_landlord
        const rooms = await landlordResponsitories.room.getAllRoomOfLandlord({
            id_landlord,
        })

        return res.status(200).send(rooms)
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const getDetailRoomByIdLandlord = async (req, res) => {
    try {
        // const id_landlord = req.user.id_landlord
        const { id_landlord, id_room } = req.params
        const rooms =
            await landlordResponsitories.room.getDetailRoomByIdLandlord({
                id_landlord,
                id_room,
            })

        return res.status(200).send(rooms)
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const createNewRoom = async (req, res) => {
    try {
        const id_landlord = req.user.id_landlord
        const inforRoom = req.body
        const rooms = await landlordResponsitories.room.createNewRoom({
            id_landlord,
            ...inforRoom,
        })

        return res.status(200).send(rooms)
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const updateInfoRoom = async (req, res) => {
    try {
        const id_landlord = req.user.id_landlord
        const inforRoom = req.body
        const rooms = await landlordResponsitories.room.updateInfoRoom({
            id_landlord,
            ...inforRoom,
        })

        return res.status(200).send(rooms)
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const deleteRoom = async (req, res) => {
    try {
        // const id_landlord = req.user.id_landlord
        const { id_landlord, id_room } = req.user
        const rooms = await landlordResponsitories.room.deleteRoom({
            id_landlord,
            id_room,
        })

        return res.status(200).send(rooms)
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

export default {
    getAllRoomOfLandlord,
    getDetailRoomByIdLandlord,
    createNewRoom,
    updateInfoRoom,
    deleteRoom,
}

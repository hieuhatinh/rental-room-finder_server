import { landlordResponsitories } from '../../responsitories/index.js'
import skip, { LIMIT, PAGE } from '../../utils/skip.js'

// landlord
const getAllRoomOfLandlord = async (req, res) => {
    try {
        const id_landlord = req.user.id
        let { page, limit } = req.query
        limit = +limit ?? LIMIT
        page = +page ?? PAGE
        const rooms = await landlordResponsitories.room.getAllRoomOfLandlord({
            id_landlord,
            page,
            skip: skip({ page, limit }),
            limit,
        })

        return res.status(200).json({
            rooms,
            message: 'Lấy các phòng thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const getDetailRoomByIdLandlord = async (req, res) => {
    try {
        const id_landlord = req.user.id
        const { id_room } = req.params
        const roomInfo =
            await landlordResponsitories.room.getDetailRoomByIdLandlord({
                id_landlord,
                id_room,
            })

        return res.status(200).json({
            roomInfo,
            message: 'Lấy thông tin phòng thành công',
        })
    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const createNewRoom = async (req, res) => {
    try {
        const id_landlord = req.user.id
        const inforRoom = req.body
        const idNewRoom = await landlordResponsitories.room.createNewRoom({
            id_landlord,
            ...inforRoom,
        })

        return res.status(200).json({
            idNewRoom,
            message: 'Thêm phòng thành công',
        })
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
        const room = await landlordResponsitories.room.updateInfoRoom({
            id_landlord,
            ...inforRoom,
        })

        return res.status(200).json({
            room,
            message: 'Cập nhật thông tin phòng thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const deleteRoom = async (req, res) => {
    try {
        const id_landlord = req.user.id
        const { id_room } = req.params
        const room = await landlordResponsitories.room.deleteRoom({
            id_landlord,
            id_room: +id_room,
        })

        return res.status(200).json({
            room,
            message: 'Xóa phòng thành công',
        })
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

import { tenantResponsitories } from '../../responsitories/index.js'
import skip from '../../utils/skip.js'

const getSomeRooms = async (req, res) => {
    try {
        const rooms = await tenantResponsitories.rooms.getSomeRooms()

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

const searchRooms = async (req, res) => {
    try {
        const {
            display_name,
            lat,
            lon,
            page,
            limit,
            amentities,
            capacity,
            radius,
            roomPrice,
            waterPrice,
            electricityPrice,
        } = req.query
        const rooms = await tenantResponsitories.rooms.searchRooms({
            display_name,
            lat,
            lon,
            page,
            limit,
            skip: skip({ page, limit }),
            amentities,
            capacity,
            radius,
            roomPrice,
            waterPrice,
            electricityPrice,
        })

        return res.status(200).json({
            rooms,
            message: 'Tìm kiếm thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const getDetailRoom = async (req, res) => {
    try {
        const { id_room } = req.params
        const roomInfo = await tenantResponsitories.rooms.getDetailRoom({
            id_room,
        })

        return res.status(200).json({
            roomInfo,
            message: 'Lấy thông tin phòng thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

export default {
    getSomeRooms,
    searchRooms,
    getDetailRoom,
}

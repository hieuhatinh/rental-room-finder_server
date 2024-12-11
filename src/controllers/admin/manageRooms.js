import { adminResponsitories } from '../../responsitories/index.js'
import { LIMIT, PAGE } from '../../utils/skip.js'

const getRoomsUnAccepted = async (req, res) => {
    try {
        let { page, limit } = req.query
        limit = limit ?? LIMIT
        page = page ?? PAGE
        const result = await adminResponsitories.manageRooms.getRoomsUnAccepted(
            {
                page,
                limit,
            },
        )

        return res.status(200).json({
            result,
            success: true,
            message: 'Lấy thông tin thành công',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

const getDetailUnacceptRoom = async (req, res) => {
    try {
        let { id_landlord, id_room } = req.params
        const result =
            await adminResponsitories.manageRooms.getDetailUnacceptRoom({
                id_landlord,
                id_room,
            })

        return res.status(200).json({
            result,
            success: true,
            message: 'Lấy thông tin thành công',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

const acceptRequest = async (req, res) => {
    try {
        let { id_landlord, id_room } = req.body
        const result = await adminResponsitories.manageRooms.acceptRequest({
            id_landlord,
            id_room,
            id_admin: req.user.id,
        })

        return res.status(200).json({
            result: {
                is_accept: true,
                id_landlord,
                id_room,
            },
            success: true,
            message: 'Đã chấp nhận yêu cầu',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

const rejectRequest = async (req, res) => {
    try {
        let { id_landlord, id_room, reason } = req.body
        const result = await adminResponsitories.manageRooms.rejectRequest({
            id_landlord,
            id_room,
            id_admin: req.user.id,
            reason,
        })

        return res.status(200).json({
            result: {
                is_accept: true,
                id_landlord,
                id_room,
            },
            success: true,
            message: 'Đã gửi yêu cầu sửa đổi',
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

export default {
    getRoomsUnAccepted,
    getDetailUnacceptRoom,
    acceptRequest,
    rejectRequest,
}

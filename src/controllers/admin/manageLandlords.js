import { adminResponsitories } from '../../responsitories/index.js'
import skip, { LIMIT, PAGE } from '../../utils/skip.js'

const addNewLandlord = async (req, res) => {
    try {
        const {
            username,
            password,
            full_name,
            gender,
            profile_img,
            birth_date,
            phone_number,
            address,
        } = req.body

        const existUser =
            await adminResponsitories.manageLandlord.addNewLandlord({
                username,
                password,
                full_name,
                gender,
                profile_img,
                birth_date,
                phone_number,
                address,
            })

        return res.status(200).json({
            user: existUser,
            success: true,
            message: 'Đăng ký chủ phòng thành công',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

const getLandlords = async (req, res) => {
    try {
        let { page, limit } = req.query
        limit = +limit ?? LIMIT
        page = +page ?? PAGE
        const result = await adminResponsitories.manageLandlord.getLandlords({
            page,
            skip: skip({ page, limit }),
            limit,
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

const getInfoLandlord = async (req, res) => {
    try {
        const { id_landlord } = req.params
        const infoLandlord =
            await adminResponsitories.manageLandlord.getInfoLandlord({
                id_landlord,
            })

        return res.status(200).json({
            infoLandlord,
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

const updateInfoLandlord = async (req, res) => {
    try {
        const { id_landlord } = req.params
        const { full_name, address_name, phone_number, birth_date } = req.body
        const infoLandlord =
            await adminResponsitories.manageLandlord.updateInfoLandlord({
                id_landlord,
                full_name,
                address_name,
                phone_number,
                birth_date,
            })

        return res.status(200).json({
            infoLandlord,
            success: true,
            message: 'Cập nhật thông tin thành công',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

const deleteLandlord = async (req, res) => {
    try {
        const { id_landlord } = req.params
        const infoLandlord =
            await adminResponsitories.manageLandlord.deleteLandlord({
                id_landlord,
            })

        return res.status(200).json({
            infoLandlord,
            success: true,
            message: 'Xoá thành công',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

export default {
    addNewLandlord,
    getLandlords,
    getInfoLandlord,
    updateInfoLandlord,
    deleteLandlord,
}

import { amentitiesResponsitories } from '../responsitories/index.js'

const getAllAmentitiesTenant = async (req, res) => {
    try {
        const amentities =
            await amentitiesResponsitories.getAllAmentitiesTenant()

        return res.status(200).json({
            amentities,
            message: 'Lấy thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const getAmentitiesId = async (req, res) => {
    try {
        const { names } = req.query
        const amentities = await amentitiesResponsitories.getAmentitiesId({
            names,
        })

        return res.status(200).json({
            amentities,
            message: 'Lấy thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

// admin, landlord
const getAllAmentityByLandlord = async (req, res) => {
    try {
        const amentities =
            await amentitiesResponsitories.getAllAmentityByLandlord()

        return res.status(200).json({
            amentities,
            message: 'Lấy thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const addAmentity = async (req, res) => {
    try {
        const { amentity } = req.body
        const newAmentity = await amentitiesResponsitories.addAmentity({
            amentity,
            userInfo: req.user,
        })

        return res.status(200).json({
            amentity,
            message: 'Thêm vào thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const getAllAmentityByAdmin = async (req, res) => {
    try {
        const amentities =
            await amentitiesResponsitories.getAllAmentityByAdmin()

        return res.status(200).json({
            amentities,
            message: 'Lấy thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const acceptAmentityByAdmin = async (req, res) => {
    try {
        const userInfo = req.user
        const { id_amentity } = req.body
        const update = await amentitiesResponsitories.acceptAmentityByAdmin({
            userInfo,
            id_amentity,
        })

        const amentities =
            await amentitiesResponsitories.getAllAmentityByAdmin()

        return res.status(200).json({
            update,
            amentities,
            message: 'Đã chấp nhận',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const refuseAmentityByAdmin = async (req, res) => {
    try {
        const userInfo = req.user
        const { id_amentity } = req.body
        const result = await amentitiesResponsitories.refuseAmentityByAdmin({
            userInfo,
            id_amentity,
        })

        const amentities =
            await amentitiesResponsitories.getAllAmentityByAdmin()

        return res.status(200).json({
            result,
            amentities,
            message: 'Đã chấp nhận',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

export default {
    getAllAmentitiesTenant,
    getAmentitiesId,
    getAllAmentityByLandlord,
    addAmentity,
    getAllAmentityByAdmin,
    acceptAmentityByAdmin,
    refuseAmentityByAdmin,
}

import { amentitiesResponsitories } from '../responsitories/index.js'

const getAllAmentities = async (req, res) => {
    try {
        const amentities = await amentitiesResponsitories.getAllAmentities()

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

export default { getAllAmentities }

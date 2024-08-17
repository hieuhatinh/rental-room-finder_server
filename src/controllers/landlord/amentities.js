import { landlordResponsitories } from '../../responsitories/index.js'

const getAllAmentities = async (req, res) => {
    try {
        const amentities =
            await landlordResponsitories.amentities.getAllAmentities()

        return res.status(200).send(amentities)
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

export default { getAllAmentities }

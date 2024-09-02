import { fileResponsitories } from '../responsitories/index.js'

const deleteFileCloudinary = async (req, res) => {
    try {
        const { public_id } = req.body
        const response = await fileResponsitories.deleteFileCloudinary(
            public_id,
        )

        return res.json(response)
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

export default { deleteFileCloudinary }

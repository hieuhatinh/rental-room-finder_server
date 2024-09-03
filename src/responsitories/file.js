import cloudinaryV2 from '../config/cloudinary.js'

const deleteFileCloudinary = async (public_id) => {
    try {
        return await cloudinaryV2.uploader.destroy(public_id)
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

export default { deleteFileCloudinary }

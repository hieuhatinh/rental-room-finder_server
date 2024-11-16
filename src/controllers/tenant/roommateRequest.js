import { tenantResponsitories } from '../../responsitories/index.js'
import skip from '../../utils/skip.js'

const getAll = async (req, res) => {
    try {
        const values = req.query
        const id_tenant = req.user?.id
        const requests = await tenantResponsitories.roommateRequest.getAll({
            id_tenant,
            ...values,
            skip: skip({ page: values.page, limit: values.limit }),
        })

        return res.status(200).json({
            requests,
            message: 'Lấy thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const getMyPosts = async (req, res) => {
    try {
        const values = req.query
        const id_tenant = req.user?.id
        const requests = await tenantResponsitories.roommateRequest.getMyPosts({
            id_tenant,
            ...values,
            skip: skip({ page: values.page, limit: values.limit }),
        })

        return res.status(200).json({
            requests,
            message: 'Lấy thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const newRequest = async (req, res) => {
    try {
        const values = req.body
        const id_tenant = req.user?.id
        const result = await tenantResponsitories.roommateRequest.newRequest({
            ...values,
            id_tenant,
        })

        return res.status(200).json({
            result,
            message: 'Tạo thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const search = async (req, res) => {
    try {
        const values = req.query
        const id_tenant = req.user?.id
        const result = await tenantResponsitories.roommateRequest.search({
            ...values,
            id_tenant,
            skip: skip({ page: values.page, limit: values.limit }),
        })

        return res.status(200).json({
            requests: result,
            message: 'Tìm kiếm thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id_tenant, id_room } = req.params
        const id_tenant_backend = req.user?.id
        const result = await tenantResponsitories.roommateRequest.deletePost({
            id_room,
            id_tenant_front: id_tenant,
            id_tenant_backend,
        })

        return res.status(200).json({
            requests: result,
            message: 'Xóa thành công',
        })
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

export default { getAll, getMyPosts, newRequest, search, deletePost }

import { knn, onehotEncoding, vectorize } from '../../ml/knn.js'
import { RoommateRequest } from '../../models/index.js'

const getAll = async ({ id_tenant, page, limit, skip }) => {
    return await RoommateRequest.getAll({ id_tenant, page, limit, skip })
}

const getMyPosts = async ({ id_tenant, page, limit, skip }) => {
    return await RoommateRequest.getMyPosts({ id_tenant, page, limit, skip })
}

const newRequest = async (values) => {
    return await RoommateRequest.createNewRequest(values)
}

const search = async (values) => {
    const hobbiesCategories = await RoommateRequest.getHobbies()
    const habitsCategories = await RoommateRequest.getHabits()

    // vector input values
    let inputHabitsOnehot = onehotEncoding(habitsCategories, values.habits)
    let inputHobbiesOnehot = onehotEncoding(hobbiesCategories, values.hobbies)
    let vectorInput = [...inputHabitsOnehot, ...inputHobbiesOnehot]

    // tìm kiếm các kết quả phù hợp với gender, location, amentities
    const data = await RoommateRequest.searchWithGenderAndLocation({
        lat: +values.lat,
        lon: +values.lon,
        gender: values.sex,
        radius: +values?.radius,
        amentities: values?.amentities,
        id_tenant: values.id_tenant,
        page: values.page,
        limit: values.limit,
        skip: values.skip,
    })

    if (data.items.length == 0) {
        return data
    }

    // vectorize data trả về
    const vectors = data.items.map((item) =>
        vectorize(item, hobbiesCategories, habitsCategories),
    )

    // model knn
    const resultOfKNN = knn(vectors, vectorInput)

    return {
        ...data,
        items: resultOfKNN.map((item) => ({
            ...data.items[item.index],
            euclideanDistance: item.value,
        })),
    }
}

const deletePost = async ({ id_room, id_tenant_front, id_tenant_backend }) => {
    try {
        if (id_tenant_front !== id_tenant_backend) {
            throw new Error('Bạn không có quyền xóa bài viết này')
        }

        return await RoommateRequest.deletePost({
            id_room,
        })
    } catch (error) {
        throw new Error(error?.message || 'Có lỗi xảy ra')
    }
}

export default { getAll, getMyPosts, newRequest, search, deletePost }

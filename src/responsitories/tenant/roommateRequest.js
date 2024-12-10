import { knn, minMaxScale, onehotEncoding, vectorize } from '../../ml/knn.js'
import { Amentity, RoommateRequest } from '../../models/index.js'

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
    let amentities = await Amentity.getAllAmentitiesTenant()
    amentities = amentities.map((item) => item.id_amentity)
    const hobbiesCategories = await RoommateRequest.getHobbies()
    const habitsCategories = await RoommateRequest.getHabits()
    const { minPrice, maxPrice } = await RoommateRequest.getMaxMinRoomPrice()

    const categoriesHobbiesArr = [...hobbiesCategories?.unique_hobbies]
    const categoriesHabitsArr = [...habitsCategories?.unique_habits]

    // vector input values
    let inputHabitsOnehot = onehotEncoding(categoriesHabitsArr, values.habits)
    let inputHobbiesOnehot = onehotEncoding(
        categoriesHobbiesArr,
        values.hobbies,
    )
    let inputAmentitiesOnehot = onehotEncoding(amentities, values.amentities)
    let xInputScale = minMaxScale(+values.price, +minPrice, +maxPrice)
    let vectorInput = [
        xInputScale,
        inputAmentitiesOnehot,
        ...inputHabitsOnehot,
        ...inputHobbiesOnehot,
    ]

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
        vectorize(
            item,
            +minPrice,
            +maxPrice,
            amentities,
            categoriesHobbiesArr,
            categoriesHabitsArr,
        ),
    )

    // model knn
    const resultOfKNN = knn(vectors, vectorInput)

    return {
        ...data,
        items: resultOfKNN.map((item) => ({
            ...data.items[item.index],
            cosineSimilarityScore: item.value,
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

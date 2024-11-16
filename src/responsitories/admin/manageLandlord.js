import {
    AdminLandlordManagementModelMySQL,
    UserModelMySQL,
} from '../../models/index.js'
import roles from '../../utils/roles.js'
import { authResponsitories } from '../index.js'

const addNewLandlord = async ({
    username,
    password,
    full_name,
    gender,
    profile_img,
    birth_date,
    phone_number,
    address,
}) => {
    const result = await authResponsitories.register({
        username,
        password,
        fullName: full_name,
        role: roles.landlord,
        gender,
        avatar: profile_img,
        profile_img,
        birth_date,
        phone_number,
        address,
    })

    return result
}

const getLandlords = async ({ page, skip, limit }) => {
    const result = await AdminLandlordManagementModelMySQL.getLandlords({
        page,
        skip,
        limit,
    })

    return result
}

const getInfoLandlord = async ({ id_landlord }) => {
    const result = await AdminLandlordManagementModelMySQL.getLandlordById({
        id_landlord,
    })

    return result
}

const updateInfoLandlord = async ({
    id_landlord,
    full_name,
    address_name,
    phone_number,
    birth_date,
}) => {
    const result = await AdminLandlordManagementModelMySQL.updateInfoLandlord({
        id_landlord,
        full_name,
        address_name,
        phone_number,
        birth_date,
    })

    return result
}

const deleteLandlord = async ({ id_landlord }) => {
    const result = await AdminLandlordManagementModelMySQL.deleteLandlord({
        id_landlord,
    })

    return result
}

export default {
    addNewLandlord,
    getLandlords,
    getInfoLandlord,
    updateInfoLandlord,
    deleteLandlord,
}

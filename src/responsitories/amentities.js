import { Amentity } from '../models/index.js'

async function getAllAmentitiesTenant() {
    return await Amentity.getAllAmentitiesTenant()
}

async function getAmentitiesId({ names }) {
    return await Amentity.getAmentitiesId({ names })
}

// landlord, admin
async function getAllAmentityByLandlord() {
    return await Amentity.getAllAmentityByLandlord()
}

async function addAmentity({ amentity, userInfo }) {
    return await Amentity.addAmentity({ amentity, userInfo })
}

async function getAllAmentityByAdmin() {
    return await Amentity.getAllAmentityByAdmin()
}

async function acceptAmentityByAdmin({ userInfo, id_amentity }) {
    return await Amentity.acceptAmentityByAdmin({ userInfo, id_amentity })
}

async function refuseAmentityByAdmin({ userInfo, id_amentity }) {
    return await Amentity.refuseAmentityByAdmin({ userInfo, id_amentity })
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

import { Amentity } from '../models/index.js'

async function getAllAmentities() {
    return await Amentity.getAllAmentities()
}

async function getAmentitiesId({ names }) {
    return await Amentity.getAmentitiesId({ names })
}

export default { getAllAmentities, getAmentitiesId }

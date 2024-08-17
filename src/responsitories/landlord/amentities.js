import { Amentity } from '../../models/index.js'

async function getAllAmentities() {
    return await Amentity.getAllAmentities()
}

export default { getAllAmentities }

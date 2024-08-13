import { getAuth } from '../models/index.js'

const login = async (req, res) => {
    const result = await getAuth()
    return result
}

export default { login }

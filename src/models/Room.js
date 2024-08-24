import { connection } from '../database/index.js'

// async function getAuth({ email = null, username = null }) {
//     try {
//         const query = 'SELECT * from users WHERE email=? or username=?'
//         const values = [email, username]
//         const [existUser] = await connection.execute(query, values)
//         return existUser
//     } catch (error) {
//         throw new Error(error || 'Có lỗi xảy ra')
//     }
// }

export default {}

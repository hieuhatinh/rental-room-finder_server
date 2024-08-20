import { connection } from '../database/index.js'

async function getAuth({ email = null, username = null }) {
    try {
        const query = 'SELECT * from users WHERE email=? or username=?'
        const values = [email, username]
        const [existUser] = await connection.execute(query, values)
        return existUser
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

async function getById({ id_user }) {
    try {
        const query = 'SELECT * from users WHERE id_user=?'
        const values = [id_user]
        const [existUser] = await connection.execute(query, values)
        return existUser
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

async function createNewUser({
    email = null,
    username = null,
    googleId = null,
    hash_password = null,
    avatar = null,
    fullName = null,
    role = 'tenant',
}) {
    try {
        const query =
            'INSERT INTO users (`email`, `username`, `google_id`, `hash_password`, `avatar`, `full_name`, `role`) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const values = [
            email,
            username,
            googleId,
            hash_password,
            avatar,
            fullName,
            role,
        ]
        const [newUser] = await connection.execute(query, values)

        if (role === 'tenant') {
            const [user] = await getAuth({ email, username })
            const values = [user.id_user]
            await connection.execute(
                'INSERT INTO tenants (id_tenant) VALUES (?)',
                values,
            )
        }
        return newUser
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

export default { getById, getAuth, createNewUser }

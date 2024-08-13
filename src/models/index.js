import { connection } from '../database/index.js'

async function getAuth({ email }) {
    try {
        const query = 'SELECT * from USERS WHERE email=?'
        const values = [email]
        const [existUser] = await connection.execute(query, values)
        return existUser
    } catch (error) {
        console.log(error)
    }
}

async function createNewUser({
    email,
    googleId,
    hash_password = null,
    avatar,
    fullName,
    role = 'tenant',
}) {
    try {
        const query =
            'INSERT INTO users (`email`, `google_id`, `hash_password`, `avatar`, full_name, `role`) VALUES (?, ?, ?, ?, ?, ?)'
        const values = [email, googleId, hash_password, avatar, fullName, role]
        const [newUser] = await connection.execute(query, values)

        if (role === 'tenant') {
            const [user] = await connection.query(`SELECT * FROM users WHERE email='${email}'`)
            const values = [user[0].id_user]
            await connection.execute(
                'INSERT INTO tenants (id_tenant) VALUES (?)',
                values,
            )
        }
        return newUser
    } catch (error) {
        console.log(error)
    }
}

export { getAuth, createNewUser }

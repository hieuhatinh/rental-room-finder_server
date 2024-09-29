import { connection } from '../database/index.js'
import roles from '../utils/roles.js'
import UserModelMG from './mongodb/UserModelMG.js'

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

async function getInfoUsersByIds({ userIds }) {
    try {
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE id_user IN (?)',
            [userIds],
        )
        return users
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
    gender = null,
    role = roles.tenant,
}) {
    try {
        const newIdUser = new UserModelMG({
            username,
            full_name: fullName,
            avatar,
        })
        await newIdUser.save()

        const query =
            'INSERT INTO users (id_user, `email`, `username`, `google_id`, `hash_password`, `avatar`, `full_name`, gender, `role`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const values = [
            newIdUser._id.toString(),
            email,
            username,
            googleId,
            hash_password,
            avatar,
            fullName,
            gender,
            role,
        ]
        const [newUser] = await connection.execute(query, values)

        if (role === roles.tenant) {
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

async function updateInformation({ avatar, full_name, id_user }) {
    try {
        const query = 'UPDATE users SET full_name=?, avatar=? WHERE id_user=?'
        const values = [full_name, avatar, id_user]
        const [userInfoUpdate] = await connection.execute(query, values)

        await UserModelMG.updateOne(
            {
                _id: id_user,
            },
            {
                full_name,
                avatar,
            },
        )

        return userInfoUpdate
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

// admin
async function createNewLandlord({
    id_landlord,
    profile_img,
    birth_date,
    phone_number,
    address,
}) {
    try {
        const query =
            'INSERT INTO landlords (id_landlord, profile_img, birth_date, phone_number, address_name) VALUES (?, ?, ?, ?, ?)'
        const values = [
            id_landlord,
            profile_img,
            birth_date,
            phone_number,
            address,
        ]
        const [newUser] = await connection.execute(query, values)
        return newUser
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

export default {
    getAuth,
    getById,
    getInfoUsersByIds,
    createNewUser,
    updateInformation,
    createNewLandlord,
}

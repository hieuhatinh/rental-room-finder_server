import { connection } from '../database/index.js'
import roles from '../utils/roles.js'
import UserModelMG from './mongodb/UserModelMG.js'

async function getAuth({ email = null, username = null }) {
    try {
        let existUser = null
        if (!!email) {
            const query = 'SELECT * from tenants WHERE email=?'
            const [user] = await connection.execute(query, [email])
            existUser = user
        } else if (!!username) {
            const query = 'SELECT * from users WHERE username=?'
            const [user] = await connection.execute(query, [username])
            existUser = user
        }
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
    profile_img = null,
    birth_date = null,
    phone_number = null,
    address = null,
    role,
}) {
    try {
        const newIdUser = new UserModelMG({
            username,
            full_name: fullName,
            avatar,
        })
        await newIdUser.save()

        const query = `
            INSERT INTO users (id_user, username, hash_password, avatar, full_name, gender, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        const values = [
            newIdUser._id.toString(),
            username,
            hash_password,
            avatar,
            fullName,
            gender,
            role,
        ]
        const [newUser] = await connection.execute(query, values)
        const [user] = await getAuth({ email, username })

        if (role === roles.tenant) {
            const tenantValues = [newIdUser._id.toString(), email, googleId]
            await connection.execute(
                'INSERT INTO tenants (id_tenant, email, google_id) VALUES (?, ?, ?)',
                tenantValues,
            )
        } else if (role === roles.landlord) {
            await createNewLandlord({
                id_landlord: newIdUser._id.toString(),
                profile_img,
                birth_date,
                phone_number,
                address,
            })
        }

        return user
    } catch (error) {
        throw new Error(error || 'Có lỗi xảy ra')
    }
}

async function updateInformation({ avatar, full_name, id_user, gender }) {
    try {
        let userInfoUpdate
        if (!!avatar || !!full_name) {
            const query =
                'UPDATE users SET full_name=?, avatar=? WHERE id_user=?'
            const values = [full_name, avatar, id_user]
            let [update] = await connection.execute(query, values)
            userInfoUpdate = update

            await UserModelMG.updateOne(
                {
                    _id: id_user,
                },
                {
                    full_name,
                    avatar,
                },
            )
        } else if (!!gender) {
            const query = 'UPDATE users SET gender=? WHERE id_user=?'
            let [update] = await connection.execute(query, [gender, id_user])
            userInfoUpdate = update
        }

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

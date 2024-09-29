import argon2 from 'argon2'

import { UserModelMySQL } from '../models/index.js'

// register tenant/admin/landlord
const register = async ({
    username,
    password,
    role,
    fullName,
    gender,
    avatar,
}) => {
    if (!username || !password) {
        throw new Error('Không có username hoặc password')
    }

    const existingUser = await UserModelMySQL.getAuth({ username })
    if (existingUser[0]) {
        throw new Error('Người dùng đã tồn tại trong hệ thống')
    }

    const hashPassword = await argon2.hash(password)

    const newUser = await UserModelMySQL.createNewUser({
        username,
        hash_password: hashPassword,
        role,
        fullName,
        gender,
        avatar,
    })

    return newUser
}

const loginForTenant = async ({ username, password }) => {
    if (!username || !password) {
        throw new Error('Không có username hoặc password')
    }

    const existingUser = await UserModelMySQL.getAuth({ username })
    if (!existingUser[0]) {
        throw new Error('Tài khoản hoặc mật khẩu sai')
    }

    const isCorrectPassword = await argon2.verify(
        existingUser[0].hash_password,
        password,
    )
    if (!isCorrectPassword) {
        throw new Error('Tài khoản hoặc mật khẩu sai')
    }

    return existingUser[0]
}

const loginSuccess = async ({ id_user }) => {
    const existingUser = await UserModelMySQL.getById({ id_user })
    if (!existingUser[0]) {
        throw new Error('Đăng nhập không thành công')
    }
    return existingUser[0]
}

// tenant
const updateInfomation = async ({ avatar, full_name, id_user }) => {
    const existingUser = await UserModelMySQL.getById({ id_user })
    if (!existingUser[0]) {
        throw new Error('Không tồn tại người dùng')
    }

    await UserModelMySQL.updateInformation({
        avatar,
        full_name,
        id_user,
    })

    const newInfoUser = await UserModelMySQL.getById({ id_user })

    return newInfoUser[0]
}

export default {
    register,
    loginForTenant,
    loginSuccess,
    updateInfomation,
}

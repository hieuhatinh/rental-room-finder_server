import bcrypt from 'bcrypt'

import { UserModel } from '../models/index.js'

const registerForTenant = async ({ email, password }) => {
    const existingUser = await UserModel.getAuth({ email })
    if (existingUser[0]) {
        throw new Error('Người dùng đã tồn tại trong hệ thống')
    }
    const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS),
    )
    const newUser = await UserModel.createNewUser({
        email,
        hash_password: hashPassword,
    })
    return newUser
}

const loginForTenant = async ({ email, password }) => {
    const existingUser = await UserModel.getAuth({ email })
    if (!existingUser[0]) {
        throw new Error('Tài khoản hoặc mật khẩu sai')
    }

    const isCorrectPassword = await bcrypt.compare(
        password,
        existingUser[0].hash_password,
    )
    if (!isCorrectPassword) {
        throw new Error('Tài khoản hoặc mật khẩu sai')
    }

    return existingUser[0]
}

export default { registerForTenant, loginForTenant }

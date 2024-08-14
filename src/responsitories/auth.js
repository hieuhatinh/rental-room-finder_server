import bcrypt from 'bcrypt'

import { UserModel } from '../models/index.js'

const registerForTenant = async ({ username, password }) => {
    if (!username || !password) {
        throw new Error('Không có username hoặc password')
    }

    const existingUser = await UserModel.getAuth({ username })
    if (existingUser[0]) {
        throw new Error('Người dùng đã tồn tại trong hệ thống')
    }

    const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS),
    )

    const newUser = await UserModel.createNewUser({
        username,
        hash_password: hashPassword,
    })
    return newUser
}

const loginForTenant = async ({ username, password }) => {
    if (!username || !password) {
        throw new Error('Không có username hoặc password')
    }

    const existingUser = await UserModel.getAuth({ username })
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

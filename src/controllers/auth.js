import jwt from 'jsonwebtoken'

import { authResponsitories } from '../responsitories/index.js'

const loginGoogleSuccess = async (req, res) => {
    try {
        const user = req.user
        const token = await jwt.sign(
            { id: user.id_user, role: user.role },
            process.env.PRIVATE_KEY_JWT,
        )

        return res.status(200).json({
            token,
            success: true,
            message: 'Đăng nhập thành công',
        })
    } catch (error) {
        return res.status(400).send(error)
    }
}

const loginSuccess = async (req, res) => {
    try {
        const id_user = req.id_user

        const existUser = await authResponsitories.loginSuccess({ id_user })
        const { hash_password, ...userWithoutPassword } = existUser

        return res.status(200).json({
            user: userWithoutPassword,
            success: true,
            message: 'Đăng nhập thành công',
        })
    } catch (error) {
        return res.status(400).send(error)
    }
}

const loginFailed = (req, res) => {
    return res.status(401).json({
        error: true,
        message: 'login failed',
    })
}

const registerFailed = (req, res) => {
    return res.status(400).json({
        error: true,
        message: error.message,
    })
}

const loginWithUsername = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await authResponsitories.loginForTenant({
            username,
            password,
        })

        const token = await jwt.sign(
            { id: user.id_user, role: user.role },
            process.env.PRIVATE_KEY_JWT,
        )

        return res.status(200).json({
            token,
            success: true,
            message: 'Thành công',
        })
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const registerWithUsername = async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await authResponsitories.registerForTenant({
            username,
            password,
        })
        return res.status(200).json({
            result,
            success: true,
            message: 'Đăng kí thành công',
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
}

const logout = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect(process.env.CLIENT_URL)
    })
}

export default {
    loginGoogleSuccess,
    loginSuccess,
    loginFailed,
    registerFailed,
    loginWithUsername,
    registerWithUsername,
    logout,
}

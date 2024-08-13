import { authResponsitories } from '../responsitories/index.js'

const loginSuccess = (req, res) => {
    if (req.user || req.session.user) {
        return res.status(200).json({
            user: req.user || req.session.user,
            success: true,
            message: 'Thành công',
        })
    } else {
        return res.status(400).json({
            error: true,
            message: 'Đăng nhập thất bại',
        })
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

const loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await authResponsitories.loginForTenant({
            email,
            password,
        })
        if (user) {
            console.log(user)
            req.session.user = user
            req.session.save((err) => {
                if (err) {
                    console.error('Lỗi khi lưu session:', err)
                }
            })
            return res.status(200).send(user)
        }
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const registerWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await authResponsitories.registerForTenant({
            email,
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

export default {
    loginSuccess,
    loginFailed,
    registerFailed,
    loginWithEmail,
    registerWithEmail,
}

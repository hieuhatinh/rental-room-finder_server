import { authResponsitories } from '../responsitories/index.js'

const loginSuccess = async (req, res) => {
    const token = await jwt.sign(
        { id: req.user.id_user },
        process.env.PRIVATE_KEY_JWT,
    )

    console.log(req.user)

    return res.status(200).json({
        user: req.user,
        token: token,
        success: true,
        message: 'Đăng nhập thành công',
    })
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
        if (user) {
            req.session.user = user
            return res.status(200)
        }
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

export default {
    loginSuccess,
    loginFailed,
    registerFailed,
    loginWithUsername,
    registerWithUsername,
}

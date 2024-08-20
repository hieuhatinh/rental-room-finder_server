import jwt from 'jsonwebtoken'

function authenticateJwt(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({
            message: 'Không có token',
        })
    }

    jwt.verify(token, process.env.PRIVATE_KEY_JWT, (err, id_user) => {
        if (err)
            return res.status(403).json({
                error: true,
                message: 'Đăng nhập thất bại',
            })

        req.id_user = id_user.id

        next()
    })
}

export default authenticateJwt

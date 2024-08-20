function authenticateSession(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.status(401).json({
            error: true,
            message: 'Đăng nhập thất bại',
        })
    }
}

export default authenticateSession

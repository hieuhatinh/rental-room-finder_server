function authenticateSession(req, res, next) {
    if (req.session && (req.session.user || req.user)) {
        req.user = req.session.user || req.user
        return next()
    }

    return res.status(401).json({
        error: true, 
        message: 'Đăng nhập thất bại'
    })
}

export default authenticateSession
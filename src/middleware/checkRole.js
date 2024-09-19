function checkLanlordRole(req, res, next) {
    if (req?.user?.role === 'landlord') {
        return next()
    }

    return res.status(401).json({
        error: true,
        message: 'Bạn không có quyền truy cập',
    })
}

function checkTenentRole(req, res, next) {
    if (req.user.role === 'tenant') {
        return next()
    }

    return res.status(401).json({
        error: true,
        message: 'Bạn không có quyền truy cập',
    })
}

function checkAdminRole(req, res, next) {
    if (req?.user?.role === 'admin') {
        return next()
    }

    return res.status(401).json({
        error: true,
        message: 'Bạn không có quyền truy cập',
    })
}

export { checkLanlordRole, checkTenentRole, checkAdminRole }

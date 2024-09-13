import roles from '../utils/roles'

function checkLanlordRole(req, res, next) {
    if (req.user.role === roles.landlord) {
        next()
    }

    return res.status(401).json({
        error: true,
        message: 'Bạn không có quyền truy cập',
    })
}

function checkTenentRole(req, res, next) {
    if (req.user.role === roles.tenant) {
        next()
    }

    return res.status(401).json({
        error: true,
        message: 'Bạn không có quyền truy cập',
    })
}

function checkAdminRole(req, res, next) {
    if (req?.user?.role === roles.admin) {
        return next()
    }

    return res.status(401).json({
        error: true,
        message: 'Bạn không có quyền truy cập',
    })
}

export { checkLanlordRole, checkTenentRole, checkAdminRole }

import express from 'express'

import { tenantController } from '../../controllers/index.js'
import authenticateJwt from '../../middleware/authenticateJwt.js'
import { checkRole } from '../../middleware/index.js'

const roommateRequestRouter = express.Router()

roommateRequestRouter.get(
    '/get-all-request',
    authenticateJwt,
    checkRole.checkTenentRole,
    tenantController.roommateRequest.getAll,
)

roommateRequestRouter.get(
    '/get-my-posts',
    authenticateJwt,
    checkRole.checkTenentRole,
    tenantController.roommateRequest.getMyPosts,
)

roommateRequestRouter.post(
    '/new-request',
    authenticateJwt,
    checkRole.checkTenentRole,
    tenantController.roommateRequest.newRequest,
)

roommateRequestRouter.get(
    '/search',
    authenticateJwt,
    checkRole.checkTenentRole,
    tenantController.roommateRequest.search,
)

roommateRequestRouter.delete(
    '/delete/:id_tenant/:id_room',
    authenticateJwt,
    checkRole.checkTenentRole,
    tenantController.roommateRequest.deletePost,
)

export default roommateRequestRouter

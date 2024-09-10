import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import { authController } from '../controllers/index.js'
import authenticateSession from '../middleware/authenticateSession.js'
import authenticateJwt from '../middleware/authenticateJwt.js'

const authRouter = express.Router()

// login
authRouter.get('/google', passport.authenticate('google', ['profile', 'email']))

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login/failed',
        successRedirect: `${process.env.CLIENT_URL}/auth/login/google/success`,
    }),
)

authRouter.get(
    '/login/google/success',
    authenticateSession,
    authController.loginGoogleSuccess,
)

authRouter.post('/login', authController.loginWithUsername)

// register/login failed/success
authRouter.get('/login/failed', authController.loginFailed)
authRouter.get('/register/failed', authController.registerFailed)

authRouter.get('/login/success', authenticateJwt, authController.loginSuccess)

// register
authRouter.post('/register/tenant', authController.registerWithUsername)

// logout
authRouter.get('/logout', authController.logout)

// update info
authRouter.put('/update-info', authenticateJwt, authController.updateInfomation)

// register admin - backend
authRouter.post('/register/admin', authController.registerAdmin)

export default authRouter

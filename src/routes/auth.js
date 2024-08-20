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

authRouter.post('/login/tenant', authController.loginWithUsername)

// register/login failed/success
authRouter.get('/login/failed', authController.loginFailed)
authRouter.get('/register/failed', authController.registerFailed)

authRouter.get('/login/success', authenticateJwt, authController.loginSuccess)

// register
authRouter.post('/register/tenant', authController.registerWithUsername)

// authRouter.get('/info', (req, res) => {
//     console.log(req.user)
//     res.status(200).json({
//         user: req.user
//     })
// })

// logout
authRouter.get('/logout', authController.logout)

export default authRouter

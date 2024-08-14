import express from 'express'

import { authController } from '../controllers/index.js'
import passport from 'passport'

const authRouter = express.Router()

// login
authRouter.get('/google', passport.authenticate('google', ['profile', 'email']))

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login/failed',
        successRedirect: process.env.CLIENT_URL,
    }),
)

authRouter.post('/login/tenant', authController.loginWithUsername)

// register/login failed/success
authRouter.get('/login/failed', authController.loginFailed)
authRouter.get('/register/failed', authController.registerFailed)

authRouter.get('/login/success', authController.loginSuccess)

// register
authRouter.post('/register/tenant', authController.registerWithUsername)

// authRouter.get('/info', (req, res) => {
//     console.log(req.user)
//     res.status(200).json({
//         user: req.user
//     })
// })

// logout
authRouter.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect(process.env.CLIENT_URL)
    })
})

export default authRouter

import express from 'express'

import { authController } from '../controllers/index.js'
import passport from 'passport'

const authRouter = express.Router()

authRouter.get('/login', authController.login)

authRouter.get('/google', passport.authenticate('google', ['profile', 'email']))

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login/failed',
        successRedirect: process.env.CLIENT_URL,
    })
)

authRouter.get('/login/failed', (req, res) => {
    res.status(401).json({
        error: true,
        message: 'login failed',
    })
})

authRouter.get('/login/success', (req, res) => {
    res.status(200).json({
        user: req.user,
        success: true,
        message: 'thafnh coong',
    })
})

// authRouter.get('/info', (req, res) => {
//     console.log(req.user)
//     res.status(200).json({
//         user: req.user
//     })
// })


authRouter.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect(process.env.CLIENT_URL)
    })
})

export default authRouter

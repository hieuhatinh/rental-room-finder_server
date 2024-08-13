import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import * as dotenv from 'dotenv'

import { UserModel } from '../models/index.js'

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async function (accessToken, refreshToken, profile, cb) {
            const existingUser = await UserModel.getAuth({
                email: profile._json.email,
            })
            if (existingUser[0]) {
                if (existingUser.hashPassword) {
                    cb(null, false, {
                        message: 'Đăng nhập bằng email, password',
                    })
                }
                cb(null, profile)
            } else {
                await UserModel.createNewUser({
                    email: profile._json.email,
                    googleId: profile.id,
                    avatar: profile._json.picture,
                    fullName: profile._json.name,
                })
                cb(null, profile)
            }
        },
    ),
)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

export default passport

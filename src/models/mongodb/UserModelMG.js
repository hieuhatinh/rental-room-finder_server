import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: false,
        },
        full_name: {
            type: String,
            require: false,
        },
        avatar: {
            type: String,
            require: false,
        },
    },
    {
        timestamps: true,
    },
)

const UserModelMG = mongoose.model('users', userSchema)

export default UserModelMG

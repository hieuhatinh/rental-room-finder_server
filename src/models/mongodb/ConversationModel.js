import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            default: '',
        },
        imageURL: {
            type: String,
            default: '',
        },
        videoUrl: {
            type: String,
            default: '',
        },
        filesUpload: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            },
        ],
        seen: {
            type: Boolean,
            default: false,
        },
        msgByUserId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'users',
        },
    },
    {
        timestamps: true,
    },
)

const conversationSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'users',
        },
        user2: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'users',
        },
        messages: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'messages',
            },
        ],
    },
    {
        timestamps: true,
    },
)

const MessageModel = mongoose.model('messages', messageSchema)
const ConversationModel = mongoose.model('conversations', conversationSchema)

export { ConversationModel, MessageModel }

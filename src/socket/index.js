import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

import {
    ConversationModel,
    MessageModel,
} from '../models/mongodb/ConversationModel.js'
import getIdFromToken from '../utils/getIdFromToken.js'
import { UserModelMySQL } from '../models/index.js'
import { chatResponsitories } from '../responsitories/index.js'
import socketAddNewRoom from './newRoom.js'

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: 'GET,POST,PUT,DELETE',
        credentials: true,
    },
})

/**
 * socket running at http://localhost:5000
 */

// online user
const onlineUser = new Set()

io.on('connection', async (socket) => {
    const token = socket.handshake.auth.token

    // current user details
    const id_user = await getIdFromToken(token)

    // create a room
    socket.join(id_user?.toString())
    onlineUser.add(id_user?.toString())

    io.emit('isUserOnline', {
        id_user,
        isOnline: true,
        onlineUsers: Array.from(onlineUser),
    })

    socket.on('message-page', async (userId) => {
        const userDetails = await UserModelMySQL.getById({ id_user: userId })
        const payload = {
            email: userDetails[0]?.email,
            username: userDetails[0]?.username,
            full_name: userDetails[0]?.full_name,
            isOnline: onlineUser.has(userId),
        }

        socket.emit('message-user', payload)

        // get previous message
        const getConversationMessage = await ConversationModel.findOne({
            $or: [
                {
                    user1: id_user,
                    user2: userId,
                },
                {
                    user1: userId,
                    user2: id_user,
                },
            ],
        })
            .populate('messages')
            .sort({ updateAt: -1 })

        socket.emit('message', getConversationMessage?.messages || [])
    })

    // new messsage
    socket.on('new message', async (data) => {
        // check conversattion is available both user
        let conversation = await ConversationModel.findOne({
            $or: [
                {
                    user1: data?.sender,
                    user2: data?.receiver,
                },
                {
                    user1: data?.receiver,
                    user2: data?.sender,
                },
            ],
        })

        // if conversation is not available
        if (!conversation) {
            const createConversation = await ConversationModel({
                user1: data?.sender,
                user2: data?.receiver,
            })
            conversation = await createConversation.save()
        }

        const message = new MessageModel({
            text: data.text,
            filesUpload: data?.listFileUpload,
            msgByUserId: data?.msgByUserId,
        })

        const saveMessage = await message.save()

        const updateConversation = await ConversationModel.updateOne(
            {
                _id: conversation?._id,
            },
            {
                $push: { messages: saveMessage?._id },
            },
        )

        const getConversationMessage = await ConversationModel.findOne({
            $or: [
                {
                    user1: data?.sender,
                    user2: data?.receiver,
                },
                {
                    user1: data?.receiver,
                    user2: data?.sender,
                },
            ],
        })
            .populate('messages')
            .sort({ updateAt: -1 })

        io.to(data?.sender).emit(
            'message',
            getConversationMessage?.messages || [],
        )
        io.to(data?.receiver).emit(
            'message',
            getConversationMessage?.messages || [],
        )

        // send conversation
        const conversationSender = await chatResponsitories.getConversation(
            data?.sender,
        )
        const conversationReceiver = await chatResponsitories.getConversation(
            data?.receiver,
        )

        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)
    })

    // sidebar
    socket.on('sidebar', async (currentUserId) => {
        // check trạng thái online của tất cả người dùng đã chat với currentUserId
        // code here

        const conversationSidebar = await chatResponsitories.getConversation(
            currentUserId,
        )

        socket.emit('conversation', conversationSidebar)
    })

    socket.on('seen', async (msgByUserId) => {
        let conversation = await ConversationModel.findOne({
            $or: [
                {
                    user1: id_user,
                    user2: msgByUserId,
                },
                {
                    user1: msgByUserId,
                    user2: id_user,
                },
            ],
        })

        const conversationMessageId = conversation?.messages || []

        await MessageModel.updateMany(
            { _id: { $in: conversationMessageId }, msgByUserId },
            { $set: { seen: true } },
        )

        // send conversation
        const conversationSender = await chatResponsitories.getConversation(
            id_user,
        )
        const conversationReceiver = await chatResponsitories.getConversation(
            msgByUserId,
        )

        io.to(id_user).emit('conversation', conversationSender)
        io.to(msgByUserId).emit('conversation', conversationReceiver)
    })

    // emit add new room
    socketAddNewRoom(socket, io)

    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(id_user)
    })
})

export { app, server }

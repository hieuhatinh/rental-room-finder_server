import { Room } from '../models/index.js'

function socketAddNewRoom(socket, io) {
    socket.on('new-room-created', async (data) => {
        // Phát lại sự kiện cho phía client
        socket.broadcast.emit('new-room-created', {
            ...data,
        })
    })

    socket.on('get-number-request', async () => {
        try {
            const numberUnacceptedRooms = await Room.countUnacceptedRooms()

            socket.emit('number-request', numberUnacceptedRooms)
        } catch (error) {
            console.log(error)
        }
    })

    // admin accept request
    socket.on('accept-request', async () => {
        socket.broadcast.emit('accept-request')
    })

    // send socket to admin to delete room notification
    socket.on('delete-room', async () => {
        socket.broadcast.emit('delete-room')
    })
}

export default socketAddNewRoom

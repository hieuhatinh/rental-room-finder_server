import { Room } from '../models/index.js'

function socketAddNewRoom(socket, io) {
    socket.on('new-room-created', async (data) => {
        // Phát lại sự kiện cho phía client
        const numberUnacceptedRooms = await Room.countUnacceptedRooms()

        socket.broadcast.emit('new-room-created', {
            ...data,
            numberUnacceptedRooms,
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
    socket.on('accept-request', async (data) => {
        socket.broadcast.emit('accept-request', data)
    })

    // admin accept request
    socket.on('reject-request', async (data) => {
        socket.broadcast.emit('reject-request', data)
    })

    // send socket to admin to delete room notification
    socket.on('delete-room', async () => {
        socket.broadcast.emit('delete-room')
    })
}

export default socketAddNewRoom

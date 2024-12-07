import { Amentity } from '../models/index.js'

function socketAddNewAmentity(socket, io) {
    socket.on('new-amentity', async (data) => {
        // Phát lại sự kiện cho phía admin
        const numberNewAmentity = await Amentity.countNewAmentity()
        socket.broadcast.emit('new-amentity', { ...data, numberNewAmentity })
    })

    socket.on('get-number-new-amentity', async () => {
        try {
            const numberNewAmentity = await Amentity.countNewAmentity()

            socket.emit('number-new-amentity', numberNewAmentity)
        } catch (error) {
            console.log(error)
        }
    })

    // chấp nhận amentity
    socket.on('accept-amentity', async (data) => {
        const idLandlords = await Amentity.findLandlordRelatedAmentity({
            amentity: data.amentity,
        })
        socket.broadcast.emit('accept-amentity', {
            idLandlords,
            amentity: data.amentity,
        })
    })

    // từ chối amentity
    socket.on('refuse-amentity', async (data) => {
        const idLandlords = await Amentity.findLandlordRelatedAmentity({
            amentity: data.amentity,
        })
        socket.broadcast.emit('refuse-amentity', {
            idLandlords,
            amentity: data.amentity,
        })
    })
}

export default socketAddNewAmentity

import { roomResponsitories } from '../responsitories/index.js'

const searchRoom = async (req, res) => {
    try {
        const resultSearch = await roomResponsitories.searchRoom()
        console.log(req.body)

        return res.status(200).send(resultSearch)
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error || 'Có lỗi xảy ra',
        })
    }
}

export default { searchRoom }

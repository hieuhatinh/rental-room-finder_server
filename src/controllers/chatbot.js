import { chatbotResponsitories } from '../responsitories/index.js'

const handleAgent = async (req, res) => {
    const { text } = req.body
    const result = await chatbotResponsitories.textQuery({ text })
    return res.status(200).send(result)
}

// const clearAllContexts = async (req, res) => {
//     const { currentSessionId } = req.body
//     await chatbotResponsitories.clearAllContexts({ currentSessionId })
// }

export default { handleAgent }

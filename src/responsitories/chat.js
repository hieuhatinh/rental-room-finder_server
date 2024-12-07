import { ConversationModel } from '../models/index.js'

const getConversation = async (currentUserId) => {
    if (currentUserId) {
        const currentuserConversation = await ConversationModel.find({
            $or: [
                {
                    user1: currentUserId,
                },
                { user2: currentUserId },
            ],
        })
            .sort({ updateAt: -1 })
            .populate('messages')
            .populate('user1')
            .populate('user2')

        const conversation = currentuserConversation.map((conv) => {
            const countUnseenMsg = conv.messages.reduce((prev, curr) => {
                const msgByUserId = curr?.msgByUserId?.toString()

                if (msgByUserId !== currentUserId) {
                    return prev + (curr.seen ? 0 : 1)
                } else {
                    return prev
                }
            }, 0)

            return {
                _id: conv?._id,
                user1: conv?.user1,
                user2: conv?.user2,
                unseenMsg: countUnseenMsg,
                lastMsg: conv.messages[conv?.messages.length - 1],
            }
        })

        return conversation
    } else {
        return []
    }
}

export default { getConversation }

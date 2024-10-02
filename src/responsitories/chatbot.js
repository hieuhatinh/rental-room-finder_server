import dialogflow from 'dialogflow'
import { WebhookClient } from 'dialogflow-fulfillment'

import configPrivateKey from '../private/privateKeyTest.js'

const sessionClient = new dialogflow.SessionsClient({
    projectId: configPrivateKey.googleDialogflowProjectId,
    credentials: {
        client_email: configPrivateKey.googleDialogflowClientEmail,
        private_key: configPrivateKey.googleDialogflowPrivateKey,
    },
})

// async function clearAllContexts({ currentSessionId }) {
//     const contextsClient = new dialogflow.ContextsClient()
//     const sessionPath = contextsClient.sessionPath(
//         configPrivateKey.googleDialogflowProjectId,
//         configPrivateKey.dialogflowSessionID,
//         currentSessionId,
//     )

//     try {
//         const [contexts] = await contextsClient.listContexts({
//             parent: sessionPath,
//         })
//         for (const context of contexts) {
//             await contextsClient.deleteContext({ name: context.name })
//         }
//     } catch (error) {
//         console.error('Error clearing contexts:', error)
//     }
// }

const textQuery = async ({ text, currentSessionId }) => {
    console.log({ currentSessionId })
    const sessionPath = sessionClient.sessionPath(
        configPrivateKey.googleDialogflowProjectId,
        configPrivateKey.dialogflowSessionID,
        currentSessionId,
    )

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: configPrivateKey.dialogflowSessionLanguageCode,
            },
        },
    }

    try {
        const response = await sessionClient.detectIntent(request)

        return response
    } catch (error) {
        throw new Error(error)
    }
}

export default { textQuery }

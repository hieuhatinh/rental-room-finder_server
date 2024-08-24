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

const textQuery = async ({ text }) => {
    const sessionPath = sessionClient.sessionPath(
        configPrivateKey.googleDialogflowProjectId,
        configPrivateKey.dialogflowSessionID,
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

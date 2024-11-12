import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import fs from 'fs'
import util from 'util'

const synthesize = async (req, res) => {
    try {
        const client = new TextToSpeechClient()
        const { text } = req.body

        const request = {
            input: { text: text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: 'vi-VN', ssmlGender: 'NEUTRAL' },
            // select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        }

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request)
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile)

        const outputFilePath = 'output.mp3'
        await writeFile(outputFilePath, response.audioContent, 'base64')

        return res.download(
            outputFilePath,
            'output.mp3',
            {
                headers: {
                    'Content-Type': 'audio/mpeg',
                },
            },
            (err) => {
                if (err) {
                    console.error('Error sending file:', err)
                    return res.status(500).send('Error sending file.')
                }
                // Xóa file sau khi gửi thành công (tùy chọn)
                fs.unlink(outputFilePath, (unlinkErr) => {
                    if (unlinkErr)
                        console.error('Error deleting file:', unlinkErr)
                })
            },
        )
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            error: true,
            message: error.message || 'Có lỗi xảy ra',
        })
    }
}

const transcript = async (req, res) => {}

export default { synthesize, transcript }

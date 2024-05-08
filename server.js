const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

require('dotenv').config()

const PORT = '8888'
const env = process.env.LINE_CHANNEL_ACCESS_TOKEN
const LINE_BOT_API = 'https://api.line.me/v2/bot'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env}`
}

app.post('/send-message', async (req, res) => {
    try {
        const { userId, message } = req.body
        const body = {
            to: userId,
            messages: [
                {
                    type: "text",
                    text: message
                }
            ]
        }

        const response = await axios.post(`${LINE_BOT_API}/message/push`, body, { headers })
        console.log("response", response.data)
        res.json({
            message: 'send message success',
            responseData: response.data
        })
    } catch (error) {
        console.log(error.response)
    }
})

const sendMessage = async (userId, message) => {
    try {
        const body = {
            to: userId,
            message: [
                {
                    type: 'text',
                    text: message
                }
            ]
        }
        const response = await axios.post(
            `${LINE_BOT_API}/message/push`, body, { headers }
        )
    } catch (error) {
        throw new Error(error)
    }
}

app.post('/webhook', async (req, res) => {
    const { events } = req.body
    console.log("req.body", req.body)
    if (!events || events.length === 0) {
        res.json({
            message: 'ok'
        })
        return false
    }
    console.log('events', events)
    const lineEvent = events[0]
    const userId = lineEvent.source.userId

    const body = {
        to: userId,
        messages: [
            {
                type: "text",
                text: "hello from webhook"
            }
        ]
    }

    const response = await axios.post(`${LINE_BOT_API}/message/push`, body, { headers })
})


app.listen(PORT, (req, res) => {
    console.log(`run at http://localhost:${PORT}`)
})
import * as dotenv from 'dotenv'

dotenv.config()

export default {
    BOT_TOKEN: process.env.BOT_TOKEN,
    PUBLIC_URL: process.env.PUBLIC_URL,
    PORT: process.env.PORT
}
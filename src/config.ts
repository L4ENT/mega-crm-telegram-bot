import * as dotenv from 'dotenv'

dotenv.config()

export default {
    BOT_TOKEN: process.env.BOT_TOKEN,
    PUBLIC_URL: process.env.PUBLIC_URL,
    PORT: process.env.PORT,
    TEMPLATES_PATH: process.env.TEMPLATES_PATH,
    DOWNLOADS_PATH: process.env.DOWNLOADS_PATH
}
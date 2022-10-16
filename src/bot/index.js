import TelegramBot from "node-telegram-bot-api";
import config from "../config.js";

import * as handlers from './handlers.js'

const bot = new TelegramBot(config.BOT_TOKEN)

bot.setWebHook(`${config.PUBLIC_URL}/bot${config.BOT_TOKEN}`);

bot.on("message", handlers.pingPong);

export default bot
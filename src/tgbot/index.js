import TelegramBot from "node-telegram-bot-api";
import TelegramApp from "../apps/telegram/TelegramApp.js";
import config from "../config.js";

const bot = new TelegramBot(config.BOT_TOKEN)

bot.setWebHook(`${config.PUBLIC_URL}/bot${config.BOT_TOKEN}`);

bot.on("message", (msg) => {
    const telegramApp = new TelegramApp()
    telegramApp.processMessage(msg)
});

bot.on("callback_query", (cbq) => {
    const telegramApp = new TelegramApp()
    telegramApp.processCallbackQuery(cbq)
});


export default bot
import TelegramBot = require("node-telegram-bot-api");
import TelegramApp from "../apps/telegram/TelegramApp";
import config from "../config";

const bot = new TelegramBot (config.BOT_TOKEN);

bot.setWebHook(`${config.PUBLIC_URL}/bot${config.BOT_TOKEN}`);

bot.on("message", (msg) => {
  const telegramApp = new TelegramApp();
  telegramApp.processMessage(msg);
});

bot.on("callback_query", (cbq) => {
  const telegramApp = new TelegramApp();
  telegramApp.processCallbackQuery(cbq);
});

export default bot;

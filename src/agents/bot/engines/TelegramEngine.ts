import {
  EditMessageTextOptions,
  SendMessageOptions,
} from "node-telegram-bot-api";

import bot from "@src/tgbot";
import MessagerEngineInterface from "@src/agents/bot/engines/MessagerEngineInterface";
import TelegramBot = require("node-telegram-bot-api");

export default class TelegramEngine implements MessagerEngineInterface {
  async sendMessage(
    chatId: string,
    text: string,
    opts: SendMessageOptions
  ): Promise<boolean | TelegramBot.Message> {
    return await bot.sendMessage(chatId, text, opts);
  }

  async editMessage(
    text: string,
    messageId: string,
    chatId: string,
    opts: EditMessageTextOptions
  ): Promise<boolean | TelegramBot.Message> {
    return await bot.editMessageText(text, {
      ...opts,
      message_id: parseInt(messageId),
      chat_id: chatId,
    });
  }

  async deleteMessage(
    chatId: string,
    messageId: string,
    opts: any
  ): Promise<boolean | TelegramBot.Message> {
    return await bot.deleteMessage(chatId, messageId, opts);
  }

  async getChatIdByIdentity(identity: string) {
    //TODO: db.messagerChat.findBy username or userId
  }
}

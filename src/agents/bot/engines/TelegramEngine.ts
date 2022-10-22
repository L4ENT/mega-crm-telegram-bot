import {
  EditMessageTextOptions,
  SendMessageOptions,
} from "node-telegram-bot-api";

import bot from "@src/tgbot";
import MessagerEngineInterface from "@src/agents/bot/engines/MessagerEngineInterface";
import TelegramBot = require("node-telegram-bot-api");
import {
  Call,
  MessagerChannel,
  Order,
  OrderMessage,
  Prisma,
  User,
} from "@prisma/client";
import db from "@src/db";
import AgentWithIdInterface from "@src/agents/AgentWithIdInterface";
import MasterAgent from "@src/agents/master/MasterAgent";
import ChannelLabels from "@src/enums/ChannelLabels";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import masterSelectInlineKeyboard, {
  callMessage,
  callMessagerInlineKeyboard,
  dispatcherOrderInlineKB,
  orderFormMessage,
  orderMessageForDispatcher,
} from "@src/agents/bot/utils";

export default class TelegramEngine implements MessagerEngineInterface {
  /**
   * Send message to Telegram
   *
   * @param chatId
   * @param text
   * @param opts
   * @returns
   */
  async sendMessage(
    chatId: string,
    text: string,
    opts?: SendMessageOptions
  ): Promise<boolean | TelegramBot.Message> {
    return await bot.sendMessage(chatId, text, opts);
  }

  /**
   * Edit message in Telegram by chatId and messageId
   *
   * @param text
   * @param messageId
   * @param chatId
   * @param opts
   * @returns
   */
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

  /**
   * Delete message from Telegram by chatId and messageId
   *
   * @param chatId
   * @param messageId
   * @param opts
   * @returns
   */
  async deleteMessage(
    chatId: string,
    messageId: string,
    opts?: any
  ): Promise<boolean | TelegramBot.Message> {
    return await bot.deleteMessage(chatId, messageId, opts);
  }

  async getChatIdByAgent(
    agent: AgentWithIdInterface
  ): Promise<string | number | null> {
    let where: {
      messagerUsers: any;
      labels?: any;
    } = {
      messagerUsers: { some: { messagerUserId: agent.identity } },
    };

    if (agent instanceof MasterAgent) {
      where.labels = {
        some: {
          messagerlabelCode: ChannelLabels.MASTER,
        },
      };
    }

    if (agent instanceof DispatcherAgent) {
      where.labels = {
        some: {
          messagerlabelCode: ChannelLabels.DISPATCHER,
        },
      };
    }

    const chats = await db.messagerChannel.findMany({ where });

    return chats.map((ch: MessagerChannel) => ch.uid).pop() || null;
  }

  /**
   * Getting all messages received by agent
   *
   * @param agent
   * @param order
   * @returns
   */
  async getOrderMessageByAgent(
    agent: AgentWithIdInterface,
    order: Order
  ): Promise<any> {
    let labels: Prisma.MessagerChannelLabelListRelationFilter;

    if (agent instanceof MasterAgent) {
      labels.some = {
        messagerlabelCode: ChannelLabels.MASTER,
      };
    }

    if (agent instanceof DispatcherAgent) {
      labels.some = {
        messagerlabelCode: ChannelLabels.DISPATCHER,
      };
    }

    const message: OrderMessage = await db.orderMessage.findFirst({
      where: {
        orderId: order.id,
        messagerChannel: {
          messagerUsers: {
            some: {
              messagerUser: {
                userId: agent.identity,
              },
            },
          },
          labels,
        },
      },
    });

    return {
      messageId: message.messageUid,
      channelId: message.chatUid,
    };
  }

  /**
   * Get order messages by channel label
   * 
   * @param order 
   * @param label 
   * @returns 
   */
  async getOrderMessagesByLabel(order: Order, label: string) {
    return await db.orderMessage.findMany({
      where: {
        orderId: order.id,
        messagerChannel: {
          labels: {
            some: {
              messagerlabelCode: label,
            },
          },
        },
      },
    });
  }

  /**
   * List of channels ids by label
   *
   * @param label
   * @returns
   */
  async getChannelIdsByLabel(label: string): Promise<any> {
    const channels = await db.messagerChannel.findMany({
      where: {
        labels: {
          some: {
            messagerlabelCode: label,
          },
        },
      },
    });
    return channels.map((ch: MessagerChannel) => ch.uid);
  }

  /**
   * Dispatcher channel. Order message
   *
   * @param chatId
   * @param order
   * @returns
   */
  async sendOrderDispatcherMessage(
    chatId: string,
    order: Order
  ): Promise<TelegramBot.Message> {
    return await bot.sendMessage(chatId, orderMessageForDispatcher(order), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: dispatcherOrderInlineKB(order),
      },
    });
  }

  /**
   * Calls channel. Order message
   *
   * @param chatId
   * @param order
   * @returns
   */
  async sendOrderFormLink(
    chatId: string,
    order: Order
  ): Promise<TelegramBot.Message> {
    return await bot.sendMessage(chatId, orderFormMessage(order), {
      parse_mode: "HTML",
    });
  }

  /**
   * Dispatcher channel. Master selection buttons
   *
   * @param chatId
   * @param order
   * @param users
   * @returns
   */
  async sendOrderMasterButtons(
    chatId: string,
    order: Order,
    users: User[]
  ): Promise<TelegramBot.Message> {
    return await bot.sendMessage(chatId, "Выберите мастера", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: masterSelectInlineKeyboard(order, users),
      },
    });
  }

  /**
   * Calls channel. Call notification
   *
   * @param chatId
   * @param call
   * @returns
   */
  async sendCallAndButtons(
    chatId: string,
    call: Call
  ): Promise<TelegramBot.Message> {
    const message = callMessage(call);

    const inlineKeyboard = callMessagerInlineKeyboard(call.callId);

    return await bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }
}

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
  Warranty,
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
  masterOrderInlineKeyboard,
  orderFormMessage,
  orderMessageForDispatcher,
  orderMessageForMaster,
} from "@src/agents/bot/utils";
import { getTelegramMessager } from "@src/apps/telegram/utils";
import config from "@src/config";
import WarrantyManager from "@src/managers/WarrantyManager";

export default class TelegramEngine implements MessagerEngineInterface {
  /**
   * Remove order mesage
   * @param order
   * @param message
   */
  async removeOrderMessage(
    order: Order,
    messageId: string,
    chatId: string
  ): Promise<any> {
    console.log("removeOrderMessage", { messageId, chatId, orderId: order.id });
    await db.orderMessage.delete({
      where: {
        orderId_chatUid_messageUid: {
          orderId: order.id,
          chatUid: chatId,
          messageUid: messageId,
        },
      },
    });
  }
  /**
   * Save order mesage
   * @param order
   * @param message
   */
  async saveOrderMessage(
    order: Order,
    message: TelegramBot.Message
  ): Promise<any> {
    const messager = await getTelegramMessager();
    const channel = await db.messagerChannel.findUnique({
      where: {
        uid_messagerId: {
          uid: message.chat.id.toString(),
          messagerId: messager.id,
        },
      },
    });
    await db.orderMessage.upsert({
      where: {
        orderId_chatUid_messageUid: {
          orderId: order.id,
          chatUid: message.chat.id.toString(),
          messageUid: message.message_id.toString(),
        },
      },
      create: {
        orderId: order.id,
        chatUid: message.chat.id.toString(),
        messageUid: message.message_id.toString(),
        messagerChannelId: channel ? channel.id : undefined,
      },
      update: {
        messagerChannelId: channel ? channel.id : undefined,
      },
    });
  }
  /**
   * Send message to Telegram
   *
   * @param chatId
   * @param text
   * @param opts
   * @returns
   */
  async sendMessage(
    chatId: string | number,
    text: string,
    opts?: SendMessageOptions
  ): Promise<TelegramBot.Message> {
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
    chatId: string | number,
    opts: EditMessageTextOptions
  ): Promise<TelegramBot.Message> {
    console.log("Telegram edit message", { messageId, chatId, text });

    let message = null;
    try {
      message = await bot.editMessageText(text, {
        ...opts,
        message_id: parseInt(messageId),
        chat_id: chatId,
      });
    } catch (error) {}
    return message;
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
  ): Promise<boolean> {
    console.log({ chatId, messageId, opts });
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
    let labels: Prisma.MessagerChannelLabelListRelationFilter = {};

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
    // TODO Fix duplicate
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
    const text = await orderMessageForDispatcher(order);
    return await bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: dispatcherOrderInlineKB(order),
      },
    });
  }

  /**
   * Master channel. Order message
   *
   * @param chatId
   * @param order
   * @returns
   */
  async sendOrderMasterMessage(
    chatId: string | number,
    order: Order
  ): Promise<TelegramBot.Message> {
    let text = await orderMessageForMaster(order);
    return await this.sendMessage(chatId.toString(), text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: masterOrderInlineKeyboard(order),
      },
    });
  }

  /**
   * Master channel. Edit order message
   *
   * @param chatId
   * @param order
   * @returns
   */
  async editOrderMasterMessage(
    chatId: string | number,
    messageId: string,
    order: Order
  ): Promise<TelegramBot.Message> {
    const text = await orderMessageForMaster(order);
    return await this.editMessage(text, messageId, chatId, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: masterOrderInlineKeyboard(order),
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

  async sendWarrantyFormLink(
    chatId: string | number,
    warranty: Warranty
  ): Promise<any> {
    const link = `${config.PUBLIC_URL}/warranty-form?o=${warranty.id}`;

    const message =
      `Заявка №${warranty.orderId}. Пожалуйста заполните данные гарантии\n` +
      `<a href="${link}">Ссылка на форму</a>`;
    await this.sendMessage(chatId, message, {
      parse_mode: "HTML",
    });
  }

  async sendWarranty(chatId: string | number, warranty: Warranty) {
    const link = WarrantyManager.getDownloadLink(warranty.id);

    const message =
      `Гарантия на заявку №${warranty.orderId}\n` +
      `<a href="${link}">Скачать гарантию</a>`;
    await this.sendMessage(chatId, message, {
      parse_mode: "HTML",
    });
  }

  async sendWarrantyToDebet(
    chatId: string | number,
    warranty: Warranty
  ): Promise<any> {
    const message =
      `Гарантия на заявку №${warranty.orderId}\n` +
      `<b> Итого за запчасти </b>: ${warranty.sparesPrice} руб.\n` +
      `<b> Итого за работу </b>: ${warranty.sparesPrice} руб.\n`;
    await this.sendMessage(chatId, message, {
      parse_mode: "HTML",
    });
  }
}

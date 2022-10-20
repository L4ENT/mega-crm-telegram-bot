import db from "../../../prisma/db.js";
import MessagerRepository from "../../repository/messager-repository.js";
import bot from "../../tgbot/index.js";
import ChannelLabels from "../telegram/enums/ChannelLabels.js";
import { getTelegramMessager } from "../telegram/utils.js";
import { dispatcherOrderInlineKB, orderMessageForDispatcher } from "./utils.js";

class OrderApp {
  async syncOrderWithMessager(order) {
    const orderMessages = await db.orderMessage.findMany({
      where: { orderId: order.id },
    });

    const excludesChatsForSend = [];
    for (let orderMessage of orderMessages) {
      const { messageUid, chatUid } = orderMessage;
      excludesChatsForSend.push(chatUid);
      await this.editOrderDispatcherMessage(chatUid, messageUid, order);
    }

    const messager = await getTelegramMessager()
    const channels = new MessagerRepository(db.messagerChannel, messager);
    const dispatcherChannels = await channels.findMany({
      where: {
        labels: {
          some: {
            messagerlabelCode: ChannelLabels.DISPATCHER,
          },
        },
      },
    });
    for (let ch of dispatcherChannels) {
      if (!excludesChatsForSend.includes(ch.uid)){
        this.sendOrderDispatcherMessage(ch.uid, order);
      }
    }
  }

  async sendOrderDispatcherMessage(chatUid, order) {
    const message = await bot.sendMessage(
      chatUid,
      orderMessageForDispatcher(order),
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: dispatcherOrderInlineKB(order),
        },
      }
    );
    await this.saveOrderMessage(order.id, message.chat.id, message.message_id);
  }

  async editOrderDispatcherMessage(chatUid, messageUid, order) {
    try {
      await bot.editMessageText(orderMessageForDispatcher(order), {
        message_id: messageUid,
        chat_id: chatUid,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: dispatcherOrderInlineKB(order),
        },
      });
    } catch {
      console.log("Same message content");
    }
  }

  async saveOrderMessage(orderId, chatUid, messageUid) {
    await db.orderMessage.upsert({
      where: {
        orderId_chatUid_messageUid: {
          orderId: orderId,
          chatUid: chatUid.toString(),
          messageUid: messageUid.toString(),
        },
      },
      create: {
        orderId: orderId,
        chatUid: chatUid.toString(),
        messageUid: messageUid.toString(),
      },
      update: {},
    });
  }
}

export default OrderApp;

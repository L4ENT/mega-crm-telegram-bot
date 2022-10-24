import db from "../../db";
import MessagerRepository from "../../repository/messager-repository";
import bot from "../../tgbot/index";
import ChannelLabels from "../../enums/ChannelLabels";
import { getTelegramMessager } from "../telegram/utils";
import {
  dispatcherOrderInlineKB,
  orderMessageForDispatcher,
  orderMessageForMaster,
} from "./utils";

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

    const messager = await getTelegramMessager();
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
      if (!excludesChatsForSend.includes(ch.uid)) {
        this.sendOrderDispatcherMessage(ch.uid, order);
      }
    }

    if (order.masterId) {
      // TODO удалить сообщение у всех остальных

      const masterOrderMessages = await db.orderMessage.findMany({
        where: {
          messagerChannel: {
            labels: {
              some: {
                messagerlabelCode: ChannelLabels.MASTER,
              },
            },
          },
        },
      });

      const masterChannels = await channels.findMany({
        where: {
          messagerUsers: {
            some: {
              messagerUser: {
                userId: order.masterId,
              },
            },
          },
          labels: {
            some: {
              messagerlabelCode: ChannelLabels.MASTER,
            },
          },
        },
      });

      const masterChannelsUids = masterChannels.map((x) => x.uid);

      for (let orderMessage of masterOrderMessages) {
        if (!masterChannelsUids.includes(orderMessage.chatUid)) {
          try {
            console.log("orderMessage", orderMessage);
            await bot.deleteMessage(
              orderMessage.chatUid,
              orderMessage.messageUid
            );
            db.orderMessage.delete({
              where: {
                orderId: order.id,
                chatUid: orderMessage.chatUid,
                messageUid: orderMessage.messageUid,
              },
            });
          } catch (err) {
            console.log("Error");
          }
        }
      }
    }
  }

  async sendOrderDispatcherMessage(chatUid, order) {
    const text = await orderMessageForDispatcher(order);
    const message = await bot.sendMessage(chatUid, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: dispatcherOrderInlineKB(order),
      },
    });
    await this.saveOrderMessage(order.id, message.chat.id, message.message_id);
  }

  async editOrderDispatcherMessage(chatUid, messageUid, order) {
    const text = await orderMessageForDispatcher(order);
    try {
      await bot.editMessageText(text, {
        message_id: messageUid,
        chat_id: chatUid,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: dispatcherOrderInlineKB(order),
        },
      });
    } catch (err) {
      console.log("Same message content");
    }
  }

  async saveOrderMessage(orderId, chatUid, messageUid) {
    const messager = await getTelegramMessager();

    const channel = await db.messagerChannel.findUnique({
      where: {
        uid_messagerId: {
          uid: chatUid.toString(),
          messagerId: messager.id,
        },
      },
    });
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
        messagerChannelId: channel ? channel.id : undefined,
      },
      update: {
        messagerChannelId: channel ? channel.id : undefined,
      },
    });
  }

  async assignMaster(orderId, userId) {
    return await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        masterId: userId,
      },
      include: {
        deviceType: true,
        master: true,
      },
    });
  }

  async sendOrderMessageToMaster(order, userId) {
    const messager = await getTelegramMessager();
    const channels = new MessagerRepository(db.messagerChannel, messager);

    const masterChannles = await channels.findMany({
      where: {
        labels: {
          some: {
            messagerlabelCode: ChannelLabels.MASTER,
          },
        },
        messagerUsers: {
          some: {
            messagerUser: {
              userId,
            },
          },
        },
      },
    });

    for (let channel of masterChannles) {
      const text = await orderMessageForMaster(order);
      const message = await bot.sendMessage(channel.uid, text, {
        parse_mode: "HTML",
      });

      await this.saveOrderMessage(order.id, channel.uid, message.message_id);
    }
  }
}

export default OrderApp;

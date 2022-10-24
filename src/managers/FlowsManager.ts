import { Order } from "@prisma/client";
import AssignMasterFlow from "@src/apps/telegram/flows/AssignmasterFlow";
import ChangeMasterFlow from "@src/apps/telegram/flows/ChangeMasterFlow";
import { getTelegramMessager } from "@src/apps/telegram/utils";
import db from "@src/db";
import { CallbackQuery, Message } from "node-telegram-bot-api";

export default class FlowsManager {
  static async startAssignMasterFlow(
    userUid: string,
    chatUid: string,
    order: Order
  ) {
    const flow = new AssignMasterFlow(order.id);
    
    const messager = await getTelegramMessager();
    await db.messagerFlow.upsert({
      where: {
        userUid_chatUid: {
          userUid: userUid.toString(),
          chatUid: chatUid.toString(),
        },
      },
      create: {
        userUid: userUid.toString(),
        chatUid: chatUid.toString(),
        messagerId: messager.id,
        active: true,
        key: flow.key,
        data: JSON.stringify({
          orderId: flow.data.orderId,
        }),
      },
      update: {
        active: true,
        messagerId: messager.id,
        key: flow.key,
        data: JSON.stringify({
          orderId: flow.data.orderId,
        }),
      },
    });
  }

  static async startMasterReassign(
    userUid: string,
    chatUid: string,
    order: Order
  ) {
    const flow = new ChangeMasterFlow(order.id);
    const messager = await getTelegramMessager();
    await db.messagerFlow.upsert({
      where: {
        userUid_chatUid: {
          userUid: userUid.toString(),
          chatUid: chatUid.toString(),
        },
      },
      create: {
        userUid: userUid.toString(),
        chatUid: chatUid.toString(),
        messagerId: messager.id,
        key: flow.key,
        active: true,
        data: JSON.stringify({
          orderId: flow.data.orderId,
        }),
      },
      update: {
        active: true,
        messagerId: messager.id,
        key: flow.key,
        data: JSON.stringify({
          orderId: flow.data.orderId,
        }),
      },
    });
  }

  static async getFlowFromMessage(msg: Message) {
    const dbFlow = await db.messagerFlow.findUnique({
      where: {
        userUid_chatUid: {
          userUid: msg.from.id.toString(),
          chatUid: msg.chat.id.toString(),
        },
      },
    });

    if (dbFlow) {
      return {
        ...dbFlow,
        data: JSON.parse(dbFlow.data),
      };
    } else {
      return null;
    }
  }

  static async getFlowFromCbq(
    cbq: CallbackQuery
  ): Promise<{ key: string; data: any }> {
    const dbFlow = await db.messagerFlow.findUnique({
      where: {
        userUid_chatUid: {
          userUid: cbq.from.id.toString(),
          chatUid: cbq.message.chat.id.toString(),
        },
      },
    });
    if (dbFlow) {
      return {
        ...dbFlow,
        data: JSON.parse(dbFlow.data),
      };
    } else {
      return null;
    }
  }
}

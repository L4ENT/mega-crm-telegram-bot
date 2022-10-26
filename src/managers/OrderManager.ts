import { Call, Order } from "@prisma/client";
import db from "@src/db";
import moment = require("moment");

export default class OrderManager {
  static async createOrderByCallId(callId: string) {
    let call: {
      id: number;
      orderId: number;
      order: Order;
      clientPhone: string;
    } = await db.call.findUnique({
      where: { callId },
      select: { id: true, orderId: true, order: true, clientPhone: true },
    });
    if (!call.orderId) {
      const order = await db.order.create({
        data: { clientPhone: call.clientPhone },
      });

      call = await db.call.update({
        where: { id: call.id },
        data: { orderId: order.id },
        select: { id: true, orderId: true, order: true, clientPhone: true },
      });
    }

    return call.order;
  }

  static async setMaster(orderId: number, masterId: number) {
    return await db.order.update({
      where: { id: orderId },
      data: { masterId },
    });
  }

  static async getById(orderId: number) {
    return await db.order.findUnique({ where: { id: orderId }})
  }

  static async getUnassignedOrders(): Promise<Order[]> {
    const _20minutesAgo = moment().add(-20, 'minute').toDate()
    const orders = await db.order.findMany({ where: { 
      masterId: null,
      updatedAt: {
        lte: _20minutesAgo
      }
    }})
    return orders
  }
}

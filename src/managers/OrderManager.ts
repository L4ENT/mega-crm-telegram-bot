import { Call, Order } from "@prisma/client";
import db from "@src/db";

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
    await db.order.update({
      where: { id: orderId },
      data: { masterId },
    });
  }
}

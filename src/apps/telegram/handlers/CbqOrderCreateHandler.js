import db from "../../../../prisma/db.js";
import bot from "../../../tgbot/index.js";
import { orderFormLink } from "../../orders/utils.js";
import CbqHandler from "./CbqHandler.js";

class CbqOrderCreateHandler extends CbqHandler {
  async createOrder(callId) {
    let call = await db.call.findUnique({
      where: { callId: callId },
      select: {id: true, orderId: true, order: true, clientPhone: true}
    });
    if (!call.orderId) {
      const order = await db.order.create({
        data: { clientPhone: call.clientPhone },
      });

      call = await db.call.update({
        where: { id: call.id },
        data: { orderId: order.id },
        select: {id: true, order: true}
      });
    }

    return call.order
  }

  async sendOrderFormLink(cbq, order, link) {
    const message = (
      `Заявка №${order.id}\n` +
      `<a href="${link}">Ссылка на форму</a>`
    )
    await bot.sendMessage(cbq.message.chat.id, message, {
      parse_mode: "HTML"
    })
  }

  async exec(cbq) {
    const data = JSON.parse(cbq.data);
    const order = await this.createOrder(data.callId);

    const link = orderFormLink(order)

    await this.sendOrderFormLink(cbq, order, link)    
  }
}

export default CbqOrderCreateHandler;

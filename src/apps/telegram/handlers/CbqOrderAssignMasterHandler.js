import db from "../../../db";
import OrderApp from "../../orders/OrderApp";
import { getTelegramMessager } from "../utils";
import CbqHandler from "./CbqHandler";

class CbqOrderAssignMasterHandler extends CbqHandler {
  async startFlow(orderId, userUid, chatUid) {
    const messager = await getTelegramMessager()
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
        data: JSON.stringify({
          code: "flow:order:setmaster",
          data: {
            orderId,
          },
        }),
      },
      update: {
        active: true,
        messagerId: messager.id,
        data: JSON.stringify({
          code: "flow:order:setmaster",
          data: {
            orderId,
          },
        }),
      },
    });
  }
  async exec(cbq) {
    const cbqData = JSON.parse(cbq.data);

    const orderApp = new OrderApp()

    const order = await orderApp.assignMaster(cbqData.orderId, cbqData.userId)

    await orderApp.sendOrderMessageToMaster(order, order.masterId)

    await orderApp.syncOrderWithMessager(order)
  }
}

export default CbqOrderAssignMasterHandler;

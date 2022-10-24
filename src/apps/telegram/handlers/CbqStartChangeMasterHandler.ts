import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import CbqHandler from "@src/apps/telegram/handlers/CbqHandler";
import CbqHandlerInterface from "@src/apps/telegram/handlers/CbqHandlerInterface";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import { getTelegramMessager } from "@src/apps/telegram/utils";
import db from "@src/db";
import FlowsManager from "@src/managers/FlowsManager";
import { CallbackQuery } from "node-telegram-bot-api";

export default class CbqStartChangeMasterHandler extends CbqHandler{
  app: TelegramApp;
  flow: any;
  
  async exec(cbq: CallbackQuery) {
    const messager = await getTelegramMessager();
    const user = await db.messagerUser.findUnique({
      where: {
        uid_messagerId: {
          uid: cbq.from.username.toString(),
          messagerId: messager.id,
        },
      },
    });
    const dispatcherAgent = new DispatcherAgent(user.id);

    const cbqData = JSON.parse(cbq.data)

    const order = await db.order.findUnique({
      where: { id: cbqData.orderId },
    });

    await FlowsManager.startMasterReassign(
      cbq.from.id.toString(),
      cbq.message.chat.id.toString(),
      order
    );

    await dispatcherAgent.actions.startAssignMasterOnOrder();
  }
}
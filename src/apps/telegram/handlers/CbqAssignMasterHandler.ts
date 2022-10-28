import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";
import AssignMasterFlow from "@src/apps/telegram/flows/AssignmasterFlow";
import CbqHandler from "@src/apps/telegram/handlers/CbqHandler";
import CbqHandlerInterface from "@src/apps/telegram/handlers/CbqHandlerInterface";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import { getTelegramMessager } from "@src/apps/telegram/utils";
import db from "@src/db";
import FlowsManager from "@src/managers/FlowsManager";
import { CallbackQuery } from "node-telegram-bot-api";

export default class CbqAssignMasterHandler extends CbqHandler{
  app: TelegramApp;
  flow: AssignMasterFlow;

  async exec(cbq: CallbackQuery) {
    const messager = await getTelegramMessager();
    const user = await db.messagerUser.findUnique({
      where: {
        uid_messagerId: {
          uid: cbq.from.id.toString(),
          messagerId: messager.id,
        },
      },
    });
    const dispatcherAgent = new DispatcherAgent(user.id);

    const order = await db.order.findUnique({
      where: { id: this.flow.data.orderId },
    });

    const cbqData = JSON.parse(cbq.data)
    const masterId = cbqData.masterId
    const master = new MasterAgent(masterId)

    await dispatcherAgent.actions.assignOrderToMaster(order, master);
    
    await FlowsManager.exitFlow(cbq.from.id.toString(), cbq.message.chat.id.toString())
  }
}
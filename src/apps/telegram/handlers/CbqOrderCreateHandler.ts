import ManagerAgent from "@src/agents/manager/ManagerAgent";
import CbqHandler from "@src/apps/telegram/handlers/CbqHandler";
import CbqHandlerInterface from "@src/apps/telegram/handlers/CbqHandlerInterface";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import db from "@src/db";
import OrderManager from "@src/managers/OrderManager";
import { CallbackQuery } from "node-telegram-bot-api";

class CbqOrderCreateHandler extends CbqHandler {
  app: TelegramApp;
  flow: any;
  
  async exec(cbq: CallbackQuery) {
    const managerAgent = new ManagerAgent();
    const cbqData = JSON.parse(cbq.data);
    const order = await OrderManager.createOrderByCallId(cbqData.callId);
    console.log(order)
    await managerAgent.actions.getOrderFormLink(order);
  }
}

export default CbqOrderCreateHandler;

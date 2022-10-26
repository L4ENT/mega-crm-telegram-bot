import MasterAgent from "@src/agents/master/MasterAgent";
import FlowInterface from "@src/apps/telegram/flows/FlowInterFace";
import CbqHandler from "@src/apps/telegram/handlers/CbqHandler";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import OrderManager from "@src/managers/OrderManager";
import WarrantyManager from "@src/managers/WarrantyManager";
import { CallbackQuery } from "node-telegram-bot-api";

class CbqMakeWarrantyHandler extends CbqHandler {
  app: TelegramApp;
  flow: FlowInterface;
  
  async exec(cbq: CallbackQuery) {
    const cbqData = JSON.parse(cbq.data);
    const order = await OrderManager.getById(cbqData.orderId)
    const warranty = await WarrantyManager.makeFromOrderId(order.id)
    const masterAgent = new MasterAgent(order.masterId)
    await masterAgent.events.onWarrantyCreated(warranty)
  }
}

export default CbqMakeWarrantyHandler;

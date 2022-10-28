import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import AssignMasterFlow from "@src/apps/telegram/flows/AssignmasterFlow";
import ChangeMasterFlow from "@src/apps/telegram/flows/ChangeMasterFlow";
import FlowInterFace from "@src/apps/telegram/flows/FlowInterFace";
import MessageHandler from "@src/apps/telegram/handlers/MessageHandler";
import MessageHandlerInterface from "@src/apps/telegram/handlers/MessageHandlerInterface";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import { getTelegramMessager } from "@src/apps/telegram/utils";
import db from "@src/db";
import { Message } from "node-telegram-bot-api";

class SearchMasterHandler extends MessageHandler {
  app: TelegramApp;
  flow: AssignMasterFlow | ChangeMasterFlow;

  async exec(msg: Message) {
    const messager = await getTelegramMessager();
    const user = await db.messagerUser.findUnique({
      where: {
        uid_messagerId: {
          uid: msg.from.id.toString(),
          messagerId: messager.id,
        },
      },
    });
    const dispatcherAgent = new DispatcherAgent(user.id);
    const order = await db.order.findUnique({ where: { id: this.flow.data.orderId } });
    
    await dispatcherAgent.actions.searchForOrderMaster(order, msg.text);
  }
}

export default SearchMasterHandler;

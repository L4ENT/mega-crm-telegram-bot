import { CallbackQuery } from "node-telegram-bot-api";
import db from "@src/db";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import FlowsManager from "@src/managers/FlowsManager";
import { getTelegramMessager } from "@src/apps/telegram/utils";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import CbqHandler from "@src/apps/telegram/handlers/CbqHandler";
import CallIdenties from "@src/enums/CallIdenties";

export default class CbqIdentyCall extends CbqHandler {
  app: TelegramApp;
  flow: any;

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

    const cbqData = JSON.parse(cbq.data);

    const call = await db.call.findUnique({
      where: { callId: cbqData.callId },
    });

    let identity = null;

    switch (cbqData.cmd) {
      case "call:sales":
        identity = CallIdenties.SALES;
        break;
      case "call:spam":
        identity = CallIdenties.SPAM;
        break;
      case "call:payout":
        identity = CallIdenties.PAYOUT;
        break;
      case "call:service":
        identity = CallIdenties.SERVICE;
        break;
      default:
        break;
    }

    if (identity) {
      await dispatcherAgent.actions.identyCall(call, identity);
    } else {
      console.log("Unexpected Call Identy:", cbqData.cmd);
    }
  }
}

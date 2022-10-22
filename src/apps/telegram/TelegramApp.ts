import bot from "@src/tgbot";
import { CallbackQuery, Message, Update } from "node-telegram-bot-api";
import CbqOrderAssignMasterHandler from "./handlers/CbqOrderAssignMasterHandler";
import CbqOrderCreateHandler from "./handlers/CbqOrderCreateHandler";
import CbqOrderSetMasterHandler from "./handlers/CbqOrderSetMasterHandler";
import SearchMasterHandler from "./handlers/SearchMasterHandler";
import simpleMessageMiddleware from "./middlewares/simple-message";
import Router from "./Router";
import { getFlowFromCbq, getFlowFromMessage } from "./utils";

const router = new Router();

router.addMessageRoute(
  (msg: Message, flow: any) => flow?.data?.code === "flow:order:setmaster",
  SearchMasterHandler
);

router.addCbqRoute(
  (cbq: CallbackQuery) => JSON.parse(cbq.data)?.cmd === "order:create",
  CbqOrderCreateHandler
);
router.addCbqRoute(
  (cbq: CallbackQuery) => JSON.parse(cbq.data)?.cmd === "order:setmaster",
  CbqOrderSetMasterHandler
);
router.addCbqRoute(
  (cbq: CallbackQuery) => JSON.parse(cbq.data)?.cmd === "order:assignmaster",
  CbqOrderAssignMasterHandler
);
router.addCbqRoute(
  (cbq: CallbackQuery) => JSON.parse(cbq.data)?.cmd === "order:changemaster",
  CbqOrderSetMasterHandler
);

class TelegramApp {
  miidlewares: ((update: any) => Promise<any>)[];
  constructor() {
    this.miidlewares = [simpleMessageMiddleware];
  }

  async processUpdate(update: Update) {
    for (let mw of this.miidlewares) {
      await mw(update);
    }
    bot.processUpdate(update);
  }

  async processMessage(msg: Message) {
    let flow = await getFlowFromMessage(msg);
    await router.serveMessage(msg, flow);
  }

  async processCallbackQuery(cbq: CallbackQuery) {
    const flow = await getFlowFromCbq(cbq);
    await router.serveCallbackQuery(cbq, flow);
  }
}

export default TelegramApp;

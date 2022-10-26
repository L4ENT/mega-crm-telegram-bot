import CbqChangeMasterHandler from "@src/apps/telegram/handlers/CbqChangeMasterHandler";
import CbqOrderCreateHandler from "@src/apps/telegram/handlers/CbqOrderCreateHandler";
import CbqAssignMasterHandler from "@src/apps/telegram/handlers/CbqAssignMasterHandler";
import CbqStartAssignMaster from "@src/apps/telegram/handlers/CbqStartAssignMaster";
import SearchMasterHandler from "@src/apps/telegram/handlers/SearchMasterHandler";
import simpleMessageMiddleware from "@src/apps/telegram/middlewares/simple-message";
import Router from "@src/apps/telegram/Router";
import FlowsManager from "@src/managers/FlowsManager";
import bot from "@src/tgbot";
import { CallbackQuery, Message, Update } from "node-telegram-bot-api";
import AssignMasterFlow from "@src/apps/telegram/flows/AssignmasterFlow";
import BaseFlow from "@src/apps/telegram/flows/BaseFlow";
import ChangeMasterFlow from "@src/apps/telegram/flows/ChangeMasterFlow";
import CbqStartChangeMasterHandler from "@src/apps/telegram/handlers/CbqStartChangeMasterHandler";
import CbqMakeWarrantyHandler from "@src/apps/telegram/handlers/CbqMakeWarrantyHandler";

const router = new Router();

/**
 * СBQ при нажатии на кнопку "Заявка"
 */
router.addCbqRoute(
  (cbq: CallbackQuery) => JSON.parse(cbq.data)?.cmd === "order:create",
  CbqOrderCreateHandler
);

/**
 * CBQ при нажатии на кнопку "Назначить мастера"
 */
router.addCbqRoute(
  (cbq: CallbackQuery) =>
    JSON.parse(cbq.data)?.cmd === `flow:start:${AssignMasterFlow.getKey()}`,
  CbqStartAssignMaster
);

/**
 * MSG когда вводим имя мастера
 */
router.addMessageRoute(
  (msg: Message, flow: BaseFlow) =>
    flow &&
    [AssignMasterFlow.getKey(), ChangeMasterFlow.getKey()].includes(flow.key),
  SearchMasterHandler
);

/**
 * CBQ когда выбираем мастера мастера
 */
router.addCbqRoute((cbq: CallbackQuery, flow: BaseFlow) => {
  const flowCondition = flow && flow.key === AssignMasterFlow.getKey();
  const cmdCondition = JSON.parse(cbq.data).cmd === "order:assignmaster";
  return flowCondition && cmdCondition;
}, CbqAssignMasterHandler);

/**
 * CBQ при нажатии на кнопку "Сменить мастера"
 */
router.addCbqRoute(
  (cbq: CallbackQuery) =>
    JSON.parse(cbq.data)?.cmd === `flow:start:${ChangeMasterFlow.getKey()}`,
  CbqStartChangeMasterHandler
);

/**
 * CBQ когда меняем мастера
 */
router.addCbqRoute((cbq: CallbackQuery, flow: BaseFlow) => {
  const flowCondition = flow && flow.key === ChangeMasterFlow.getKey();
  const cmdCondition = JSON.parse(cbq.data).cmd === "order:assignmaster";
  return flowCondition && cmdCondition;
}, CbqChangeMasterHandler);

/**
 * CBQ когда меняем мастера
 */
router.addCbqRoute((cbq: CallbackQuery, flow: BaseFlow) => {
  return JSON.parse(cbq.data).cmd === "order:warranty";
}, CbqMakeWarrantyHandler);

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
    let flow = await FlowsManager.getFlowFromMessage(msg);
    await router.serveMessage(msg, flow);
  }

  async processCallbackQuery(cbq: CallbackQuery) {
    const flow = await FlowsManager.getFlowFromCbq(cbq);
    await router.serveCallbackQuery(cbq, flow);
  }
}

export default TelegramApp;

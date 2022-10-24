import FlowInterface from "@src/apps/telegram/flows/FlowInterFace";
import CbqHandler from "@src/apps/telegram/handlers/CbqHandler";
import MessageHandler from "@src/apps/telegram/handlers/MessageHandler";
import { CallbackQuery, Message } from "node-telegram-bot-api";
import bot from "../../tgbot/index";

class Router {
  messageRoutes: any[];
  callbackQueryRoutes: any[];
  
  constructor() {
    this.messageRoutes = [];
    this.callbackQueryRoutes = [];
  }

  addMessageRoute(condition, Handler: typeof MessageHandler) {
    this.messageRoutes.push([condition, Handler]);
  }

  addCbqRoute(condition, Handler: typeof CbqHandler) {
    this.callbackQueryRoutes.push([condition, Handler]);
  }

  async serveMessage(msg: Message, flow: FlowInterface) {
    const handlers = [];
    for (let [condition, Handler] of this.messageRoutes) {
      if (condition(msg, flow)) {
        handlers.push(new Handler(this, flow));
      }
    }

    for (let h of handlers) {
      await h.exec(msg);
    }
  }

  async serveCallbackQuery(cbq: CallbackQuery, flow: FlowInterface) {
    const handlers = [];
    for (let [condition, Handler] of this.callbackQueryRoutes) {
      if (condition(cbq, flow)) {
        handlers.push(new Handler(this, flow));
      }
    }

    for (let h of handlers) {
      await h.exec(cbq);
    }

    bot.answerCallbackQuery(cbq.id);
  }
}

export default Router;

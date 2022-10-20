import bot from "../../tgbot/index.js";

class Router {
  constructor() {
    this.messageRoutes = [];
    this.callbackQueryRoutes = [];
  }

  addMessageRoute(condition, Handler) {
    this.messageRoutes.push([condition, Handler]);
  }

  addCbqRoute(condition, Handler) {
    this.callbackQueryRoutes.push([condition, Handler]);
  }

  async serveMessage(msg, flow) {
    const handlers = [];
    for (let [condition, Handler] of this.messageRoutes) {
      if (condition(msg, flow)) {
        handlers.push(new Handler(flow));
      }
    }

    for (let h of handlers) {
      await h.exec(msg);
    }
  }

  async serveCallbackQuery(cbq, flow) {
    const handlers = [];
    for (let [condition, Handler] of this.callbackQueryRoutes) {
      if (condition(cbq, flow)) {
        handlers.push(new Handler(flow));
      }
    }

    for (let h of handlers) {
      await h.exec(cbq);
    }

    bot.answerCallbackQuery(cbq.id);
  }
}

export default Router;

import bot from '../../tgbot/index.js';
import CbqOrderCreateHandler from './handlers/CbqOrderCreateHandler.js';
import CbqOrderSetMasterHandler from './handlers/CbqOrderSetMasterHandler.js';
import MessageHandler from './handlers/MessageHandler.js';
import simpleMessageMiddleware from './middlewares/simple-message.js'
import Router from './Router.js';
import { getFlowFromCbq, getFlowFromMessage } from './utils.js';

const router = new Router()

router.addMessageRoute((msg, flow) => flow.data.code === "flow:order:setmaster", MessageHandler)

router.addCbqRoute((cbq) => JSON.parse(cbq.data)?.cmd === 'order:create', CbqOrderCreateHandler)
router.addCbqRoute((cbq) => JSON.parse(cbq.data)?.cmd === 'order:setmaster', CbqOrderSetMasterHandler)

class TelegramApp {
  constructor(){
    this.miidlewares = [
      simpleMessageMiddleware
    ]
  }

  async processUpdate(update){
    for(let mw of this.miidlewares) {
      await mw(update)
    }
    bot.processUpdate(update);
  }

  async processMessage(msg){
    let flow = await getFlowFromMessage(msg)
    await router.serveMessage(msg, flow)
  }

  async processCallbackQuery(cbq){
    const flow = await getFlowFromCbq(cbq)
    await router.serveCallbackQuery(cbq, flow)
  }
}

export default TelegramApp

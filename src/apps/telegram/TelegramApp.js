import bot from '../../tgbot/index';
import CbqOrderAssignMasterHandler from './handlers/CbqOrderAssignMasterHandler';
import CbqOrderCreateHandler from './handlers/CbqOrderCreateHandler';
import CbqOrderSetMasterHandler from './handlers/CbqOrderSetMasterHandler';
import SearchMasterHandler from './handlers/SearchMasterHandler';
import simpleMessageMiddleware from './middlewares/simple-message'
import Router from './Router';
import { getFlowFromCbq, getFlowFromMessage } from './utils';

const router = new Router()

router.addMessageRoute((msg, flow) => flow?.data?.code === "flow:order:setmaster", SearchMasterHandler)

router.addCbqRoute((cbq) => JSON.parse(cbq.data)?.cmd === 'order:create', CbqOrderCreateHandler)
router.addCbqRoute((cbq) => JSON.parse(cbq.data)?.cmd === 'order:setmaster', CbqOrderSetMasterHandler)
router.addCbqRoute((cbq) => JSON.parse(cbq.data)?.cmd === 'order:assignmaster', CbqOrderAssignMasterHandler)
router.addCbqRoute((cbq) => JSON.parse(cbq.data)?.cmd === 'order:changemaster', CbqOrderSetMasterHandler)

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

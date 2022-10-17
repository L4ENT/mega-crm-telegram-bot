import prisma from '../../../prisma/client.js';
import bot from '../../tgbot/index.js';
import CbqHandler from './handlers/CbqHandler.js';
import MessageHandler from './handlers/MessageHandler.js';
import simpleMessageMiddleware from './middlewares/simple-message.js'
import Router from './Router.js';

const router = new Router()

router.addMessageRoute(() => true, MessageHandler)
router.addCbqRoute(() => true, CbqHandler)

class TelegramApp {
  constructor(){
    this.miidlewares = [
      simpleMessageMiddleware
    ]
  }

  async processUpdate(update){
    for(let mw of this.miidlewares) {
      await mw(prisma, update)
    }
    bot.processUpdate(update);
  }

  async processMessage(msg){
    await router.serveMessage(msg)
  }

  async processCallbackQuery(cbq){
    await router.serveCallbackQuery(cbq)
  }
}

export default TelegramApp

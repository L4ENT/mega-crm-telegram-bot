import bot from '../../../tgbot/index.js'
import BaseHandler from './BaseHandler.js' 

class MessageHandler extends BaseHandler {
    async exec(msg){
        bot.sendMessage(msg.chat.id, 'Message!!')
    }
}

export default MessageHandler
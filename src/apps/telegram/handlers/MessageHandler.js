import bot from '../../../tgbot/index'
import BaseHandler from './BaseHandler' 

class MessageHandler extends BaseHandler {
    async exec(msg){
        bot.sendMessage(msg.chat.id, 'Message!!')
    }
}

export default MessageHandler
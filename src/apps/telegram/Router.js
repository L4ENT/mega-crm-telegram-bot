import prisma from "../../../prisma/client.js"
import bot from "../../tgbot/index.js"

class Router {
    constructor(){
        this.messageRoutes = []
        this.callbackQueryRoutes = []
    }
    addMessageRoute(condition, Handler) {
        this.messageRoutes.push([condition, Handler])
    }
    addCbqRoute(condition, Handler) {
        this.callbackQueryRoutes.push([condition, Handler])
    }

    async serveMessage(msg) {
        const handlers = []
        for (let [condition, Handler] of this.messageRoutes) {
            if(condition(msg)){
                handlers.push(new Handler(prisma))
            }
        }

        for (let h of handlers){
            await h.exec(msg)
        }
    }

    async serveCallbackQuery(cbq) {
        const handlers = []
        for (let [condition, Handler] of this.callbackQueryRoutes) {
            if(condition(cbq)){
                handlers.push(new Handler(prisma))
            }
        }

        for (let h of handlers){
            await h.exec(cbq)
        }

        bot.answerCallbackQuery(cbq.id, {text: 'Done'})
    }
}

export default Router
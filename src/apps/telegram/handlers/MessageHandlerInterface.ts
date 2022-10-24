import HandlerInterface from "@src/apps/telegram/handlers/HandlerInterface"
import { Message } from "node-telegram-bot-api"

export default interface MessageHandlerInterface extends HandlerInterface {
    exec(msg: Message): Promise<any>
}

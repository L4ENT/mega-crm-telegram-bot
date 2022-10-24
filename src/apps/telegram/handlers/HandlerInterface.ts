import { CallbackQuery } from "node-telegram-bot-api";

export default interface HandlerInterface {
    flow: any
    exec(cbq: any): Promise<any>
}
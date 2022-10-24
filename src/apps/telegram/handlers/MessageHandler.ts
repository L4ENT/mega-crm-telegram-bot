import FlowInterface from "@src/apps/telegram/flows/FlowInterFace";
import CbqHandlerInterface from "@src/apps/telegram/handlers/CbqHandlerInterface";
import MessageHandlerInterface from "@src/apps/telegram/handlers/MessageHandlerInterface";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import { CallbackQuery, Message } from "node-telegram-bot-api";

export default class MessageHandler implements MessageHandlerInterface {
    app: TelegramApp;
    flow: FlowInterface;
    
    constructor(app: TelegramApp, flow:any) {
        this.app = app
        this.flow = flow
    }
    
    exec(msg: Message): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
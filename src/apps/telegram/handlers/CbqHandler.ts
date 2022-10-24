import FlowInterface from "@src/apps/telegram/flows/FlowInterFace";
import CbqHandlerInterface from "@src/apps/telegram/handlers/CbqHandlerInterface";
import TelegramApp from "@src/apps/telegram/TelegramApp";
import { CallbackQuery } from "node-telegram-bot-api";

export default class CbqHandler implements CbqHandlerInterface {
    app: TelegramApp;
    flow: FlowInterface;
    
    constructor(app: TelegramApp, flow:any) {
        this.app = app
        this.flow = flow
    }
    
    exec(cbq: CallbackQuery): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
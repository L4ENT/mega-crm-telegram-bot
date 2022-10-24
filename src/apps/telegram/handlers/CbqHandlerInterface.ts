import TelegramApp from '@src/apps/telegram/TelegramApp'
import { CallbackQuery } from 'node-telegram-bot-api'
import HandlerInterface from './HandlerInterface'

export default interface CbqHandlerInterface extends HandlerInterface {
    app: TelegramApp
    flow: any
    exec(cbq: CallbackQuery): Promise<any>
}
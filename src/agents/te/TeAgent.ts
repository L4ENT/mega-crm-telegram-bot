import BotAgent from "@src/agents/bot/BotAgent";
import { telegramBotAgent } from "@src/agents/bot/di";
import TeActions from "@src/agents/te/actions/TeActions";
import TeEvents from "@src/agents/te/events/TeEvents";

export default class TeAgent {
    events: TeEvents;
    actions: TeActions;
    bot: BotAgent

    constructor() {
        this.events = new TeEvents(this)
        this.actions = new TeActions(this)
        this.bot = telegramBotAgent
    }   
}


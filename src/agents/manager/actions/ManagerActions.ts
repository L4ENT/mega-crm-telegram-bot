import { Order } from "@prisma/client";
import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import AgentInterface from "@src/agents/AgentInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import { telegramBotAgent } from "@src/agents/bot/di";
import ManagerAgent from "@src/agents/manager/ManagerAgent";

export default class ManagerActions implements AgentActionsInterface {
    agent: AgentInterface;
    bot: BotAgent

    constructor(agent: ManagerAgent) {
        this.agent = agent
        this.bot = telegramBotAgent
    }

    async getOrderFormLink(order: Order) {
        await this.bot.events.onOrderLink(order)
    }

    async fillOrder(order: Order) {
        await this.bot.events.onOrderFilled(order)
    }

    async updateOrder(order: Order) {
        await this.bot.events.onOrderUpdate(order)
    }
}
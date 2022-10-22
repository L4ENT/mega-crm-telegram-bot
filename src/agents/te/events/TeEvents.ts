import { Call } from "@prisma/client";
import TeAgent from "@src/agents/te/TeAgent";
import CallDto from "@src/dto/CallDto";
import CallManager from "@src/managers/CallManager";

export default class TeEvents {
    agent: TeAgent;

    constructor(agent: TeAgent){
        this.agent = agent
    }

    async onNewCall(dto: CallDto) {
        const call: Call = await CallManager.createCall(dto)
        await this.agent.bot.events.onNewCall(call)
    }
}
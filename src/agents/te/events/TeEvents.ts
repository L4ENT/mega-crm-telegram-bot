import TeAgent from "@src/agents/te/TeAgent";
import CallDto from "@src/dto/CallDto";

export default class TeEvents {
    agent: TeAgent;

    constructor(agent: TeAgent){
        this.agent = agent
    }

    async onNewCall(dto: CallDto) {
        console.log('TeAgent.onNewCall', {
            dto
        })
    }
}
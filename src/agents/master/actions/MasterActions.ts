import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import MasterAgent from "@src/agents/master/MasterAgent";

export default class MasterActions implements AgentActionsInterface {
    agent: MasterAgent;

    constructor(agent: MasterAgent) {
        this.agent = agent
    }

    async finishOrder(){
        throw Error("Not implemented")
    }
}
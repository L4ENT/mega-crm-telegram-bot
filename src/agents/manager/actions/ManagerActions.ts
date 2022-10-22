import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import AgentInterface from "@src/agents/AgentInterface";
import ManagerAgent from "@src/agents/manager/ManagerAgent";

export default class ManagerActions implements AgentActionsInterface {
    agent: AgentInterface;
    constructor(agent: ManagerAgent) {
        this.agent = agent
    }
}
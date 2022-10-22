import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import ManagerAgent from "@src/agents/manager/ManagerAgent";

export default class ManagerEvents implements AgentEventsInterface {
    agent: ManagerAgent;
    constructor(agent: ManagerAgent){
        this.agent = agent
    }
}
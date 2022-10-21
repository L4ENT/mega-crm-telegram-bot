import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import AgentWithIdInterface from "@src/agents/AgentWithIdInterface";
import BotAgent from "@src/agents/bot/BotAgent";

class BotActions implements AgentActionsInterface {
    agent: BotAgent;

    constructor(agent: BotAgent) {
        this.agent = agent
    }

    async getChatByAgent(agent: AgentWithIdInterface) {
        return await this.agent.messagerEngine.getChatIdByIdentity(agent.identity)
    }
}
export default BotActions
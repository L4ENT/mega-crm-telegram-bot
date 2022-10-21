import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";

export default interface AgentInterface {
    events: AgentEventsInterface
    actions: AgentActionsInterface
}
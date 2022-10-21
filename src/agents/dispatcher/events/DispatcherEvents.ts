import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";

export default class DispatcherEvents implements AgentEventsInterface {
  agent: DispatcherAgent;

  constructor(agent: DispatcherAgent) {
    this.agent = agent;
  }
}

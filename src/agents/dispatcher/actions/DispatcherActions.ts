import { Order } from "@prisma/client";
import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";

export default class DispatcherActions implements AgentActionsInterface {
  agent: DispatcherAgent;

  constructor(agent: DispatcherAgent) {
    this.agent = agent;
  }

  async searchForOrderMaster(order: Order, query: string) {
    await this.agent.bot.events.onOrderMasterSearch(order, this.agent, query);
  }

  async assignOrderToMaster(order: Order, master: MasterAgent) {
    await master.events.onOrderAssign(order)
  }
}

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
    // The bot will send keyboard with buttons (each button user option)  
    await this.agent.bot.events.onOrderMasterSearch(order, this.agent, query);
  }

  async assignOrderToMaster(order: Order, master: MasterAgent) {
    // Set order master
    await master.events.onOrderAssign(order)
    // Notify bot about it
    await this.agent.bot.events.onOrderMasterAssign(order, master)
  }
}

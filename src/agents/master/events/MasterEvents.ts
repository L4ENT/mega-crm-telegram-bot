import { Order } from "@prisma/client";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import MasterAgent from "@src/agents/master/MasterAgent";
import OrderManager from "@src/managers/OrderManager";

class MasterEvents implements AgentEventsInterface{
  agent: MasterAgent;
  
  constructor(agent: MasterAgent) {
    this.agent = agent;
  }

  async onOrderAssign(order: Order) {
    await OrderManager.setMaster(order.id, parseInt(this.agent.identity))
    this.agent.bot.events.onOrderMasterAssign(order, this.agent)
  }
}

export default MasterEvents
import { Order, Warranty } from "@prisma/client";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import MasterAgent from "@src/agents/master/MasterAgent";
import OrderManager from "@src/managers/OrderManager";

class MasterEvents implements AgentEventsInterface {
  agent: MasterAgent;

  constructor(agent: MasterAgent) {
    this.agent = agent;
  }

  async onOrderAssign(order: Order) {
    const updatedOrder: Order = await OrderManager.setMaster(
      order.id,
      parseInt(this.agent.identity)
    );
    await this.agent.bot.events.onOrderMasterAssign(updatedOrder, this.agent);
  }

  async onOrderUnassign(order: Order) {
    const updatedOrder: Order = await OrderManager.setMaster(
      order.id,
      parseInt(this.agent.identity)
    );
    await this.agent.bot.events.onOrderMasterAssign(updatedOrder, this.agent);
  }

  async onWarrantyCreated(warranty: Warranty){
    await this.agent.bot.events.onWarrantyCreated(this.agent, warranty)
  }

  async onWarrantyIssued(warranty: Warranty){
    await this.agent.bot.events.onWarrantyIssued(this.agent, warranty)
  }
}

export default MasterEvents;
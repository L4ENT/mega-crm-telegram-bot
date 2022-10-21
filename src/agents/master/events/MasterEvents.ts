import { Order } from "@prisma/client";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import MasterAgent from "@src/agents/master/MasterAgent";

class MasterEvents implements AgentEventsInterface{
  agent: MasterAgent;
  
  constructor(agent: MasterAgent) {
    this.agent = agent;
  }

  async onOrderAssign(order: Order) {

  }
}

export default MasterEvents
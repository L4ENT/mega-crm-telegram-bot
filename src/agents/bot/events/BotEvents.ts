import { Order } from "@prisma/client";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";
import CallDto from "@src/dto/CallDto";

class BotEvents implements AgentEventsInterface{
  agent: BotAgent;

  constructor(agent: BotAgent) {
    this.agent = agent;
  }
  
  async onNewCall(call: CallDto) {
    console.log("onNewCall", call);
  }

  async onCallIdent(call: CallDto) {
    console.log("onCallIdent", call);
  }

  async onOrderUpdate(order: Order) {
    console.log("onOrderUpdate", order);
  }

  async onOrderMasterSearch(order: Order, dispatcher: DispatcherAgent, query: string) {
    console.log("onOrderMasterSearch", {
      order,
      query,
    });
  }

  async onOrderMasterAssign(order: Order, master: MasterAgent) {
    console.log("onOrderMasterAssign", {
      order,
      master,
    });
  }

  async onOrderMasterСhange(order: Order, from: MasterAgent, to: MasterAgent) {
    console.log("onOrderMasterСhange", {
      order,
      from,
      to,
    });
  }

  async onReceiptCreated(order: Order) {
    console.log("onReceiptCreated", {
      order,
    });
  }
}

export default BotEvents;

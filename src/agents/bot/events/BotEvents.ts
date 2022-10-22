import { Call, Order } from "@prisma/client";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";
import CallIdenties from "@src/enums/CallIdenties";
import ChannelLabels from "@src/enums/ChannelLabels";
import MasterManager from "@src/managers/MasterManager";

class BotEvents implements AgentEventsInterface {
  agent: BotAgent;

  constructor(agent: BotAgent) {
    this.agent = agent;
  }

  async onNewCall(call: Call) {
    // Just send new call-messsage to special channel
    await this.agent.actions.sendOutCallMessage(call)
  }

  async onCallIdent(call: Call, callIdenty: string) {
    if (callIdenty === CallIdenties.ORDER) {
      await this.agent.actions.sendOutCallMessage(call);
    } else {
      let chatIds = [];
      if (callIdenty === CallIdenties.SALES) {
        chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
          ChannelLabels.CALLS_SALES
        );
      }
      if (callIdenty === CallIdenties.SPAM) {
        chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
          ChannelLabels.CALLS_SPAM
        );
      }
      if (callIdenty === CallIdenties.PAYOUT) {
        chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
          ChannelLabels.CALLS_PAYOUT
        );
      }
      if (callIdenty === CallIdenties.SERVICE) {
        chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
          ChannelLabels.CALLS_SERVICE
        );
      }

      for (let chatId of chatIds) {
        // TODO: Implement text of message
        await this.agent.messagerEngine.sendMessage(
          chatId,
          "Call for Identy chat"
        );
      }
    }
  }

  async onOrderUpdate(order: Order) {
    await this.agent.actions.editMasterOrderMessages(order);
    await this.agent.actions.editDispatcherOrderMessages(order);
  }

  async onOrderMasterSearch(
    order: Order,
    dispatcher: DispatcherAgent,
    query: string
  ) {
    // Get all masters by name
    const masters = await MasterManager.searchByName(query);
    // Send master buttons to dispatcher 
    await this.agent.actions.sendOrderMasterSelector(order, dispatcher, masters);
  }

  async onOrderMasterAssign(order: Order, master: MasterAgent) {
    // Notify master
    await this.agent.actions.sendMasterOrderMessage(master, order);
    // Change order message for all dispatchers
    await this.agent.actions.editDispatcherOrderMessages(order);
  }

  async onOrderMasterСhange(order: Order, from: MasterAgent, to: MasterAgent) {
    await this.agent.actions.sendMasterOrderMessage(to, order);
    await this.agent.actions.removeMasterOrderMessage(from, order);
    await this.agent.actions.editDispatcherOrderMessages(order);
  }

  async onReceiptCreated(order: Order) {
    console.log("onReceiptCreated", {
      order,
    });
    throw Error("Not implemented");
  }
}

export default BotEvents;

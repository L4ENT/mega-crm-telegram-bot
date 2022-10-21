import { Call, Order } from "@prisma/client";
import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";
import ChannelLabels from "@src/enums/ChannelLabels";

class BotActions implements AgentActionsInterface {
  agent: BotAgent;

  constructor(agent: BotAgent) {
    this.agent = agent;
  }

  async sendMasterOrderMessage(master: MasterAgent, order: Order) {
    const chatId = await this.agent.messagerEngine.getChatIdByIdentity(
      master.identity
    );
    //TODO: Build order message with receip button
    await this.agent.messagerEngine.sendMessage(chatId, `Заявка №${order.id}`);
    // TODO: Save message to db
  }

  async removeMasterOrderMessage(master: MasterAgent, order: Order) {
    const { chatId, messageId } =
      await this.agent.messagerEngine.getOrderMessageByIdentity(
        master.identity,
        order
      );
    await this.agent.messagerEngine.deleteMessage(chatId, messageId);
    // TODO: Remove message from db
  }

  async editDispatcherOrderMessages(order: Order) {
    const messages = await this.agent.messagerEngine.getOrderMessagesByLabel(
      order,
      ChannelLabels.DISPATCHER
    );
    for (let { chatId, messageId } of messages) {
      // TODO: Implement text of message
      await this.agent.messagerEngine.editMessage(
        "Новая версия заявки диспетчера",
        messageId,
        chatId
      );
    }
  }

  async editMasterOrderMessages(order: Order) {
    const messages = await this.agent.messagerEngine.getOrderMessagesByLabel(
      order,
      ChannelLabels.MASTER
    );
    for (let { chatId, messageId } of messages) {
      // TODO: Implement text of message
      await this.agent.messagerEngine.editMessage(
        "Новая версия заявки для мастера",
        messageId,
        chatId
      );
    }
  }

  async sendDispatcherCallMessage(call: Call) {
    const chatIds = await this.agent.messagerEngine.getChatsByLabel(
      ChannelLabels.DISPATCHER
    );
    for (let chatId of chatIds) {
      // TODO: Buid dispatcher call message
      await this.agent.messagerEngine.sendMessage(chatId, "Новый звонок");
      // TODO: Save message to db
    }
  }

  async sendOrderMastersButtons(
    order: Order,
    dispatcher: DispatcherAgent,
    masters: MasterAgent[]
  ) {
    // TODO: How to reply to channel insted of chat??
    const chatId = await this.agent.messagerEngine.getChatIdByIdentity(
      dispatcher.identity
    );
    await this.agent.messagerEngine.sendOrderMasterButtons(
      chatId,
      order,
      masters.map((master: MasterAgent) => master.identity.toString())
    );
  }

  async sendOutCallMessage(call: Call) {
    const chatIds = await this.agent.messagerEngine.getChatsByLabel(
      ChannelLabels.CALLS_OUTCOMING
    );

    for(let chatId of chatIds) {
      // TODO: Build call message
      this.agent.messagerEngine.sendMessage(chatId, 'New call Message')
    }
  }
}
export default BotActions;

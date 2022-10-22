import { Call, Order } from "@prisma/client";
import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import {
  orderMessageForDispatcher,
  orderMessageForMaster,
} from "@src/agents/bot/utils";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";
import db from "@src/db";
import ChannelLabels from "@src/enums/ChannelLabels";

class BotActions implements AgentActionsInterface {
  agent: BotAgent;

  constructor(agent: BotAgent) {
    this.agent = agent;
  }

  /**
   * Отправляем сообщение о звонке в канал "Исходящие"
   *
   * @param call
   */
  async sendOutCallMessage(call: Call) {
    const chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
      ChannelLabels.CALLS_OUTCOMING
    );

    for (let chatId of chatIds) {
      this.agent.messagerEngine.sendCallAndButtons(chatId, call);
    }
  }

  /**
   * Отправляем сообщение в канал "Исходящие" с ссылкой на форму
   *
   * @param order
   */
  async sendOrderFormLink(order: Order) {
    const chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
      ChannelLabels.CALLS_OUTCOMING
    );

    for (let chatId of chatIds) {
      this.agent.messagerEngine.sendOrderFormLink(chatId, order);
    }
  }

  /**
   * Отправляем Диспетчеру сообщение о созданной заявке
   * (сейчас отправляем всем диспетчерам во все каналы)
   *
   * @param order
   */
  async sendOrderDispatcherMessage(order: Order) {
    const chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
      ChannelLabels.DISPATCHER
    );

    for (let chatId of chatIds) {
      this.agent.messagerEngine.sendOrderDispatcherMessage(chatId, order);
    }
  }

  /**
   * Отправляем Диспетчеру селектор выбора мастера
   *
   * @param order
   * @param dispatcher
   * @param masters
   */
  async sendOrderMasterSelector(
    order: Order,
    dispatcher: DispatcherAgent,
    masters: MasterAgent[]
  ) {
    // TODO: How to reply to channel insted of chat??
    const chatId = await this.agent.messagerEngine.getChatIdByAgent(dispatcher);

    const users = await db.user.findMany({
      where: {
        id: { in: masters.map((m: MasterAgent) => m.identity).map(parseInt) },
      },
    });
    await this.agent.messagerEngine.sendOrderMasterButtons(
      chatId.toString(),
      order,
      users
    );
  }

  /**
   * Исправляем все сообщения о заявки в каналах диспетчеров
   *
   * @param order
   */
  async editDispatcherOrderMessages(order: Order) {
    const messages = await this.agent.messagerEngine.getOrderMessagesByLabel(
      order,
      ChannelLabels.DISPATCHER
    );
    for (let { chatId, messageId } of messages) {
      await this.agent.messagerEngine.editMessage(
        orderMessageForDispatcher(order),
        messageId,
        chatId,
        {
          reply_markup: {
            inline_keyboard: [],
          },
        }
      );
    }
  }

  /**
   * Отправляем мастеру сообщение о новой заявке
   *
   * @param master
   * @param order
   */
  async sendMasterOrderMessage(master: MasterAgent, order: Order) {
    const chatId = await this.agent.messagerEngine.getChatIdByAgent(master);

    let message = orderMessageForMaster(order);
    await this.agent.messagerEngine.sendMessage(chatId.toString(), message);
    // TODO: Save message to db
  }

  /**
   * Исправляем все сообщения о заказе у мастеров
   *
   * @param order
   */
  async editMasterOrderMessages(order: Order) {
    const messages = await this.agent.messagerEngine.getOrderMessagesByLabel(
      order,
      ChannelLabels.MASTER
    );
    for (let { chatId, messageId } of messages) {
      // TODO: Implement text of message
      await this.agent.messagerEngine.editMessage(
        orderMessageForMaster(order),
        messageId,
        chatId
      );
    }
  }

  /**
   * Удаляем сообщение о заявке у старых мастеров
   *
   * @param master
   * @param order
   */
  async removeMasterOrderMessage(master: MasterAgent, order: Order) {
    const { chatId, messageId } =
      await this.agent.messagerEngine.getOrderMessageByAgent(master, order);
    await this.agent.messagerEngine.deleteMessage(chatId, messageId);
    // TODO: Remove message from db
  }
}
export default BotActions;

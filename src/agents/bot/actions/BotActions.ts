import { Call, Order, Warranty } from "@prisma/client";
import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import {
  dispatcherOrderInlineKB,
  orderMessageForDispatcher,
  orderMessageForMaster,
} from "@src/agents/bot/utils";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";
import db from "@src/db";
import ChannelLabels from "@src/enums/ChannelLabels";
import { Message } from "node-telegram-bot-api";

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
      const mesage: Message =
        await this.agent.messagerEngine.sendOrderDispatcherMessage(
          chatId,
          order
        );
      await this.agent.messagerEngine.saveOrderMessage(order, mesage);
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
        id: { in: masters.map((m: MasterAgent) => parseInt(m.identity)) },
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
    console.log("editDispatcherOrderMessages.messages", messages);
    for (let { chatUid, messageUid } of messages) {
      const text = await orderMessageForDispatcher(order);
      await this.agent.messagerEngine.editMessage(text, messageUid, chatUid, {
        reply_markup: {
          inline_keyboard: dispatcherOrderInlineKB(order),
        },
        parse_mode: "HTML",
      });
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
    const message = await this.agent.messagerEngine.sendOrderMasterMessage(
      chatId,
      order
    );
    await this.agent.messagerEngine.saveOrderMessage(order, message);
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
    for (let { chatUid, messageUid } of messages) {
      await this.agent.messagerEngine.editOrderMasterMessage(
        chatUid,
        messageUid,
        order
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
    const message = await this.agent.messagerEngine.getOrderMessageByAgent(
      master,
      order
    );

    if (message) {
      const { channelId, messageId } = message;
      await this.agent.messagerEngine.deleteMessage(channelId, messageId);
      await this.agent.messagerEngine.removeOrderMessage(
        order,
        messageId,
        channelId
      );
    }
  }

  /**
   * Отправляем ссыдку на форму с гарантией
   *
   * @param master
   * @param warranty
   */
  async sendWarrantyFormLink(master: MasterAgent, warranty: Warranty) {
    const chatId = await this.agent.messagerEngine.getChatIdByAgent(master);
    await this.agent.messagerEngine.sendWarrantyFormLink(chatId, warranty);
  }

  /**
   * Отправляем мастеру гарантию
   *
   * @param master
   * @param warranty
   */
  async sendWarrantyToMaster(master: MasterAgent, warranty: Warranty) {
    const chatId = await this.agent.messagerEngine.getChatIdByAgent(master);
    await this.agent.messagerEngine.sendWarranty(chatId, warranty);
  }
  /**
   * Отправляем мастеру гарантию
   *
   * @param master
   * @param warranty
   */
  async sendWarrantyToDebetChannel(warranty: Warranty) {
    const chatIds = await this.agent.messagerEngine.getChannelIdsByLabel(
      ChannelLabels.DEBET
    );
    for (let chatId of chatIds) {
      await this.agent.messagerEngine.sendWarrantyToDebet(chatId, warranty);
    }
  }
}
export default BotActions;

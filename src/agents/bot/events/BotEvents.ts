import { Call, Order, Warranty } from "@prisma/client";
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

  /**
   * Поступил новый звонок
   *
   * @param call
   */
  async onNewCall(call: Call) {
    // Just send new call-messsage to special channel
    await this.agent.actions.sendOutCallMessage(call);
  }

  /**
   * Запрос на заполенение заявки
   *
   * @param order
   */
  async onOrderLink(order: Order) {
    await this.agent.actions.sendOrderFormLink(order);
  }

  /**
   * Звонку назначена категория
   *
   * @param call
   * @param callIdenty
   */
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

  /**
   * Заявка заполнена
   *
   * @param order
   */
  async onOrderFilled(order: Order) {
    await this.agent.actions.sendOrderDispatcherMessage(order);
  }

  /**
   * Попытка найти мастера
   *
   * @param order
   * @param agent
   */
  async onStartAssignMaster(agent: DispatcherAgent) {
    // TODO: отправляем сообщение мол введите имя мастера

    const chatId = await this.agent.messagerEngine.getChatIdByAgent(agent);

    await this.agent.messagerEngine.sendMessage(
      chatId,
      "Пожалуйста введите имя мастера"
    );
  }

  /**
   * Попытка найти мастера
   *
   * @param order
   * @param dispatcher
   * @param query
   */
  async onOrderMasterSearch(
    order: Order,
    dispatcher: DispatcherAgent,
    query: string
  ) {
    const masters = await MasterManager.searchByName(query);
    await this.agent.actions.sendOrderMasterSelector(
      order,
      dispatcher,
      masters
    );
  }

  /**
   * Выбор мастера для заявки
   *
   * @param order
   * @param master
   */
  async onOrderMasterAssign(order: Order, master: MasterAgent) {
    await this.agent.actions.sendMasterOrderMessage(master, order);
    await this.agent.actions.editDispatcherOrderMessages(order);
  }

  /**
   * Смена мастера
   *
   * @param order
   * @param from
   * @param to
   */
  async onOrderMasterUnassign(order: Order, master: MasterAgent) {
    await this.agent.actions.removeMasterOrderMessage(master, order);
  }

  /**
   * Обновление заказа
   *
   * @param order
   */
  async onOrderUpdate(order: Order) {
    await this.agent.actions.editMasterOrderMessages(order);
    await this.agent.actions.editDispatcherOrderMessages(order);
  }

  /**
   * Гарантия создана отправлям ссылку на форму
   *
   * @param master
   * @param warranty
   */
  async onWarrantyCreated(master: MasterAgent, warranty: Warranty) {
    this.agent.actions.sendWarrantyFormLink(master, warranty);
  }

   /**
   * Гарантия выпущена. Закидываем ее в ТГ мастеру, в канал DEPOSIT и клиенту
   *
   * @param master
   * @param warranty
   */
    async onWarrantyIssued(master: MasterAgent, warranty: Warranty) {
      this.agent.actions.sendWarrantyToMaster(master, warranty);
    }
}

export default BotEvents;

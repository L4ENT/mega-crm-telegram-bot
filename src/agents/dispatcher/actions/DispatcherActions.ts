import { Order } from "@prisma/client";
import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import DispatcherAgent from "@src/agents/dispatcher/DispatcherAgent";
import MasterAgent from "@src/agents/master/MasterAgent";

export default class DispatcherActions implements AgentActionsInterface {
  agent: DispatcherAgent;

  constructor(agent: DispatcherAgent) {
    this.agent = agent;
  }

  /**
   * Поиск мастера по миени (отправляет кнопки в чат)
   *
   * @param order
   * @param query
   */
  async startAssignMasterOnOrder() {
    await this.agent.bot.events.onStartAssignMaster(this.agent);
  }

  /**
   * Поиск мастера по миени (отправляет кнопки в чат)
   *
   * @param order
   * @param query
   */
  async searchForOrderMaster(order: Order, query: string) {
    await this.agent.bot.events.onOrderMasterSearch(order, this.agent, query);
  }

  /**
   * Назначаем мастера на заявку
   *
   * @param order
   * @param master
   */
  async assignOrderToMaster(order: Order, master: MasterAgent) {
    await master.events.onOrderAssign(order);
  }

  /**
   * меняем мастера
   *
   * @param order
   * @param newMaster
   */
  async changeOrderMaster(order: Order, newMaster: MasterAgent) {
    await newMaster.events.onOrderAssign(order);
    const oldMaster = new MasterAgent(order.masterId);
    await this.agent.bot.events.onOrderMasterUnassign(order, oldMaster);
  }
}

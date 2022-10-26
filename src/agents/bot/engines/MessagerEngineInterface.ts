import { Call, Order, User, Warranty } from "@prisma/client";
import AgentWithIdInterface from "@src/agents/AgentWithIdInterface";

interface MessagerEngineInterface {
  sendMessage(chatId: string | number, text: string, opts?: any): Promise<any>;
  editMessage(
    text: string,
    messageId: string,
    chatId: string,
    opts?: any
  ): Promise<any>;
  deleteMessage(
    chatId: string,
    messageId: string,
    opts?: any
  ): Promise<boolean>;
  getChatIdByAgent(
    agent: AgentWithIdInterface
  ): Promise<string | number | null>;
  getOrderMessageByAgent(
    identity: AgentWithIdInterface,
    order: Order
  ): Promise<any>;
  getOrderMessagesByLabel(order: Order, label: string): Promise<any>;
  getChannelIdsByLabel(label: string): Promise<any>;
  sendOrderMasterButtons(
    chatId: string,
    order: Order,
    users: User[]
  ): Promise<any>;
  sendCallAndButtons(chatId: string, call: Call): Promise<any>;
  sendOrderDispatcherMessage(chatId: string, order: Order): Promise<any>;
  sendOrderMasterMessage(chatId: string | number, order: Order): Promise<any>;
  editOrderMasterMessage(
    chatId: string | number,
    messageId: string,
    order: Order
  ): Promise<any>;
  sendOrderFormLink(chatId: string, order: Order): Promise<any>;
  saveOrderMessage(order: Order, message: any): Promise<any>;
  removeOrderMessage(
    order: Order,
    messageId: string,
    chatId: string
  ): Promise<any>;
  sendWarrantyFormLink(chatId: string | number, warranty: Warranty): Promise<any>
  sendWarranty(chatId: string | number, warranty: Warranty): Promise<any>
  sendWarrantyToDebet(chatId: string | number, warranty: Warranty): Promise<any>
}

export default MessagerEngineInterface;

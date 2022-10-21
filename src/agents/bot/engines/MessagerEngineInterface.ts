import { Order } from "@prisma/client";

interface MessagerEngineInterface {
    sendMessage(chatId: string, text: string, opts?: any): Promise<any>;
    editMessage(text: string, messageId: string, chatId: string, opts?:any): Promise<any>;
    deleteMessage(chatId: string, messageId: string, opts?: any): Promise<any>; 
    getChatIdByIdentity(identity: string): Promise<any>
    getOrderMessageByIdentity(identity: string, order: Order): Promise<any>
    getOrderMessagesByLabel(order: Order, label: string): Promise<any>
    getChatsByLabel(label: string): Promise<any>
    sendOrderMasterButtons(chatId: string, order: Order, masterIdentities: string[]): Promise<any>
}

export default MessagerEngineInterface
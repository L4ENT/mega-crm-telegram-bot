interface MessagerEngineInterface {
    sendMessage(chatId: string, text: string, opts: any): Promise<any>;
    editMessage(text: string, messageId: string, chatId: string, opts:any): Promise<any>;
    deleteMessage(chatId: string, messageId: string, opts: any): Promise<any>; 
    getChatByIdentity(identity: string): Promise<any>
}

export default MessagerEngineInterface
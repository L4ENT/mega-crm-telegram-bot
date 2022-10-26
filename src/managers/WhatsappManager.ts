import { Warranty } from "@prisma/client";
import WarrantyManager from "@src/managers/WarrantyManager";

export default class WhatsappManager {
  static async sendWarranty(warranty: Warranty, phone: string) {
    const axios = require('axios');
    await axios.post(
      "https://api.wazzup24.com/v3/message",
      {
        channelId: "3376e1c3-26a6-478b-b964-72bf01cc22cb",
        chatType: "whatsapp",
        chatId: phone,
        contentUri: WarrantyManager.getDownloadLink(warranty.id),
      },
      {
        headers: {
          Authorization: "Bearer c8cf90444023482f909520d454368d27",
          "Content-Type": "application/json",
        },
      }
    );
  }
}

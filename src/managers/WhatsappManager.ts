import { Warranty } from "@prisma/client";
import WarrantyManager from "@src/managers/WarrantyManager";

export default class WhatsappManager {
  static async sendWarranty(warranty: Warranty, phone: string) {
    console.log({
      channelId: "3376e1c3-26a6-478b-b964-72bf01cc22cb",
      chatType: "whatsapp",
      chatId: phone,
      contentUri: WarrantyManager.getDownloadLink(warranty.id),
    })
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
          Authorization: "Bearer fece2f59ddc34dbb8861c1d921a46187",
          "Content-Type": "application/json",
        },
      }
    );
  }
}

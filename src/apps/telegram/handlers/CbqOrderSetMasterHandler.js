import db from "../../../../prisma/db.js";
import bot from "../../../tgbot/index.js";
import { getTelegramMessager } from "../utils.js";
import CbqHandler from "./CbqHandler.js";

class CbqOrderSetMasterHandler extends CbqHandler {
  async startFlow(orderId, userUid, chatUid) {
    const messager = await getTelegramMessager()
    await db.messagerFlow.upsert({
      where: {
        userUid_chatUid: {
          userUid: userUid.toString(),
          chatUid: chatUid.toString(),
        },
      },
      create: {
        userUid: userUid.toString(),
        chatUid: chatUid.toString(),
        messagerId: messager.id,
        active: true,
        data: JSON.stringify({
          code: "flow:order:setmaster",
          data: {
            orderId,
          },
        }),
      },
      update: {
        active: true,
        messagerId: messager.id,
        data: JSON.stringify({
          code: "flow:order:setmaster",
          data: {
            orderId,
          },
        }),
      },
    });
  }
  async exec(cbq) {
    const cbqData = JSON.parse(cbq.data);
    console.log(this.flow)
    await this.startFlow(
      cbqData.orderId,
      cbq.message.from.id,
      cbq.message.chat.id
    );

    await bot.sendMessage(
      cbq.message.chat.id,
      "Пожалуйста введите имя или фамилию мастера",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Выйти",
                callback_data: JSON.stringify({
                  cmd: "flow:exit",
                }),
              },
            ],
          ],
        },
      }
    );
  }
}

export default CbqOrderSetMasterHandler;

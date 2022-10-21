import db from "../../../db";
import bot from "../../../tgbot/index";
import { getTelegramMessager } from "../utils";
import CbqHandler from "./CbqHandler";

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
          orderId
        }),
      },
      update: {
        active: true,
        messagerId: messager.id,
        data: JSON.stringify({
          code: "flow:order:setmaster",
          orderId
        }),
      },
    });
  }
  async exec(cbq) {
    const cbqData = JSON.parse(cbq.data);

    await this.startFlow(
      cbqData.orderId,
      cbq.from.id,
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

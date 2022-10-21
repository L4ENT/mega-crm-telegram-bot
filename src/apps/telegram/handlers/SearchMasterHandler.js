import db from "../../../db";
import bot from "../../../tgbot/index";
import BaseHandler from "./BaseHandler";

class SearchMasterHandler extends BaseHandler {
  buildInlineKeybord(users, orderId) {
    const inlineKeyboard = [];
    for (let messagerUser of users) {
      inlineKeyboard.push([
        {
          text: messagerUser.user.fullName,
          callback_data: JSON.stringify({
            cmd: "order:assignmaster",
            orderId,
            userId: messagerUser.user.id,
          }),
        },
      ]);
    }
    return inlineKeyboard;
  }

  async exec(msg) {
    const users = await db.messagerUser.findMany({
      where: {
        user: {
          fullName: {
            contains: msg.text,
          },
        },
      },
      include: {
        user: true,
      },
    });

    if (users) {
      bot.sendMessage(msg.chat.id, "Выберите мастера", {
        reply_markup: {
          inline_keyboard: this.buildInlineKeybord(
            users,
            this.flow.data.orderId
          ),
        },
      });
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Мастер не найден... Попробуйте ввести по-другому"
      );
    }
  }
}

export default SearchMasterHandler;

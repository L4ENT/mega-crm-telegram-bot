import { CallbackQuery, Message } from "node-telegram-bot-api";
import db from "../../db";

export async function getTelegramMessager() {
  return await db.messager.findUnique({ where: { code: "telegram" } });
}

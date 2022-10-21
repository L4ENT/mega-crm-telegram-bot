import BotAgent from "@src/agents/bot/BotAgent";
import TelegramEngine from "@src/agents/bot/engines/TelegramEngine";

export const telegramBotAgent = new BotAgent(new TelegramEngine());

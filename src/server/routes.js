import bot from "../tgbot/index.js";
import callsApp from "./apps/callsApp.js";
import tgApp from "./apps/tgApp.js";

/**
 * Handles every Telephone exchange API event
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const callsEntry = (req, res) => {
  const result = callsApp.handleRequest(req.body);
  res.status(200).json(result);
};

/**
 * Handles every Telelegram Bot API event (WebHook)
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const tgBotWebHook = async (req, res) => {
  const { prisma } = req.app
  await tgApp.preprocessMessage(prisma, req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
};

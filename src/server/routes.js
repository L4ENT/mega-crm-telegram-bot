import bot from "../tgbot/index.js";
import CallsApp, { CallRequestDto } from "./apps/callsApp.js";
import messagerModel from "../model/messager/messagerModel.js";
import tgApp from "./apps/tgApp.js";
import moment from "moment";

/**
 * Handles every Telephone exchange API event
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const callsEntry = async (req, res) => {
  
  const { app: { prisma }, body } = req
  
  const messager = await messagerModel.getUnique(prisma, { code: "telegram" });

  const dto = new CallRequestDto(
    body.type.toUpperCase(),
    body.status.toUpperCase(),
    body.phone,
    moment(body.start).toDate(),
    body.duration,
    body.callid,
    body.link
  )
  const callsApp = new CallsApp(prisma, messager);
  const result = callsApp.process(dto);
  
  res.status(200).json(result);
};

/**
 * Handles every Telelegram Bot API event (WebHook)
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const tgBotWebHook = async (req, res) => {
  const { prisma } = req.app;
  
  await tgApp.preprocessMessage(prisma, req.body);

  bot.processUpdate(req.body);

  res.sendStatus(200);
};

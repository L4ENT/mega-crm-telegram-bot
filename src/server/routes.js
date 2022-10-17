import moment from "moment";
import CallsApp from "../apps/calls/CallsApp.js";
import messagerModel from "../model/messager/messagerModel.js";
import CallRequestDto from "../apps/calls/dto/CallRequestDto.js";
import TelegramApp from "../apps/telegram/TelegramApp.js";

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
  const result = callsApp.processRequest(dto);
  
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
  
  const telegramApp = new TelegramApp(prisma)

  await telegramApp.processUpdate(req.body);

  res.sendStatus(200);
};

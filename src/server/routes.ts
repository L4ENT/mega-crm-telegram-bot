import moment = require("moment");
import db from "../db";
import CallsApp from "../apps/calls/CallsApp";
import OrderApp from "../apps/orders/OrderApp";
import TelegramApp from "../apps/telegram/TelegramApp";
import { getTelegramMessager } from "../apps/telegram/utils";
import CallDto from "@src/dto/CallDto";
import TeAgent from "@src/agents/te/TeAgent";

/**
 * Handles every Telephone exchange API event
 * @param req
 * @param res
 */
export const callsEntry = async (
  req: import("express").Request,
  res: import("express").Response
) => {
  const { body } = req;

  const dto = new CallDto(
    body.type.toUpperCase(),
    body.status.toUpperCase(),
    body.phone,
    moment(body.start).toDate(),
    body.duration,
    body.callid,
    body.link
  );

  const teAgent = new TeAgent();
  await teAgent.events.onNewCall(dto);
  res.status(200);
};

/**
 * Handles every Telelegram Bot API event (WebHook)
 * @param req
 * @param res
 */
export const tgBotWebHook = async (
  req: import("express").Request,
  res: import("express").Response
) => {
  const telegramApp = new TelegramApp();

  await telegramApp.processUpdate(req.body);

  res.sendStatus(200);
};

/**
 * Serving order form
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const orderFormPage = async (
  req: import("express").Request,
  res: import("express").Response
) => {
  if (!parseInt(req.query.t.toString())) {
    res.sendStatus(404);
    return;
  }

  let order = await db.order.findUnique({
    where: { id: parseInt(req.query.t.toString()) },
    include: {
      deviceType: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!order) {
    res.sendStatus(404);
    return;
  }

  let saved = false;

  if (req.method == "POST") {
    order = await db.order.update({
      where: { id: order.id },
      data: {
        clientName: req.body.clientName,
        additionalPhone: req.body.additionalPhone,
        fullAddress: req.body.fullAddress,
        defect: req.body.defect,
        brand: req.body.brand,
        model: req.body.model,
        deviceTypeId: parseInt(req.body.deviceTypeId),
        date: !order.date ? moment().toDate() : undefined,
      },
      include: {
        deviceType: {
          select: {
            id: true,
            title: true,
          },
        },
        master: true,
      },
    });

    const orderApp = new OrderApp();
    await orderApp.syncOrderWithMessager(order);
  }

  const deviceTypes = await db.deviceType.findMany();

  res.render("order-form", { order, saved, deviceTypes });
};

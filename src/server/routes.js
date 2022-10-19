import moment from "moment";
import CallsApp from "../apps/calls/CallsApp.js";
import messagerModel from "../model/messager/messagerModel.js";
import CallRequestDto from "../apps/calls/dto/CallRequestDto.js";
import TelegramApp from "../apps/telegram/TelegramApp.js";
import db from "../../prisma/db.js";
import OrderApp from "../apps/orders/OrderApp.js";

/**
 * Handles every Telephone exchange API event
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const callsEntry = async (req, res) => {
  const {
    app: { prisma },
    body,
  } = req;

  const messager = await messagerModel.getUnique(prisma, { code: "telegram" });

  const dto = new CallRequestDto(
    body.type.toUpperCase(),
    body.status.toUpperCase(),
    body.phone,
    moment(body.start).toDate(),
    body.duration,
    body.callid,
    body.link
  );
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
export const orderFormPage = async (req, res) => {
  if(!parseInt(req.query.t)) {
    res.sendStatus(404)
    return
  }

  let order = await db.order.findUnique({ 
    where: { id: parseInt(req.query.t) },
    include: {
      deviceType: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
  
  if(!order) {
    res.sendStatus(404)
    return 
  }
  
  let saved = false

  if(req.method == "POST") {
    order = await db.order.update({
      where: { id: order.id},
      data: {
        clientName: req.body.clientName,
        additionalPhone: req.body.additionalPhone,
        fullAddress: req.body.fullAddress,
        defect: req.body.defect,
        brand: req.body.brand,
        model: req.body.model,
        deviceTypeId: parseInt(req.body.deviceTypeId),
        date: !order.date ? moment().toDate(): undefined
      },
      include: {
        deviceType: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    const orderApp = new OrderApp()
    await orderApp.syncOrderWithMessager(order)
  }

  const deviceTypes = await db.deviceType.findMany()

  res.render("order-form", { order, saved, deviceTypes });
};

import moment = require("moment");
import fs = require("fs");
import db from "../db";
import TelegramApp from "../apps/telegram/TelegramApp";
import CallDto from "@src/dto/CallDto";
import TeAgent from "@src/agents/te/TeAgent";
import ManagerAgent from "@src/agents/manager/ManagerAgent";
import ChannelLabels from "@src/enums/ChannelLabels";
import config from "@src/config";
import createReport from "docx-templates";
import WarrantyManager from "@src/managers/WarrantyManager";
import MasterAgent from "@src/agents/master/MasterAgent";
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
  res.status(200).json({});
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

  let submited = false;

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

    const managerAgent = new ManagerAgent();

    const messagesCount = await db.orderMessage.count({
      where: {
        orderId: order.id,
        messagerChannel: {
          labels: {
            some: {
              messagerlabelCode: ChannelLabels.DISPATCHER,
            },
          },
        },
      },
    });
    if (messagesCount > 0) {
      managerAgent.actions.updateOrder(order);
    } else {
      managerAgent.actions.fillOrder(order);
    }

    submited = true
  }

  const deviceTypes = await db.deviceType.findMany();

  res.render("order-form", { order, submited, deviceTypes });
};

/**
 * Serving warranty form
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const warrantyFormPage = async (
  req: import("express").Request,
  res: import("express").Response
) => {
  if (!parseInt(req.query.o.toString())) {
    res.sendStatus(404);
    return;
  }

  let warranty = await db.warranty.findUnique({
    where: { id: parseInt(req.query.o.toString()) },
    include: {
      order: true,
    },
  });

  if (!warranty) {
    res.sendStatus(404);
    return;
  }

  let submited = false;

  if (req.method == "POST") {
    console.log(req.body);
    warranty = await db.warranty.update({
      where: { id: warranty.id },
      data: {
        period: moment(req.body.period).toDate(),
        typeOfJob: req.body.typeOfJob,
        sparesPrice: parseFloat(req.body.sparesPrice),
        workPrice: parseFloat(req.body.workPrice),
      },
      include: {
        order: true,
      },
    });

    const masterAgent = new MasterAgent(warranty.order.masterId);
    await masterAgent.events.onWarrantyIssued(warranty)

    submited = true;
  }

  res.render("warranty-form", {
    warranty: {
      ...warranty,
      period: moment(warranty.period).format("YYYY-MM-DD"),
    },
    warrantyLink: WarrantyManager.getDownloadLink(warranty.id),
    submited,
  });
};

/**
 * Downloading docx file
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const downloadWarranty = async (
  req: import("express").Request,
  res: import("express").Response
) => {
  if (!parseInt(req.params.warrantyId)) {
    res.sendStatus(404);
    return;
  }

  let warranty = await db.warranty.findUnique({
    where: { id: parseInt(req.params.warrantyId) },
    include: {
      order: true,
    },
  });

  if (!warranty) {
    res.sendStatus(404);
    return;
  }
  console.log("Before read template");
  const template = fs.readFileSync(
    config.TEMPLATES_PATH + "docx/warranty-template.docx"
  );

  console.log("Before create report");
  const buffer = await createReport({
    template,
    data: {
      period: moment(warranty.period).format("DD.MM.YYYY"),
      typeOfJob: warranty.typeOfJob,
      sparesPrice: warranty.sparesPrice,
      workPrice: warranty.workPrice,
    },
  });

  const filePath = config.DOWNLOADS_PATH + `warranty-${warranty.id}.docx`;

  console.log("Before write file");
  fs.writeFileSync(filePath, buffer);

  console.log("Before download");
  res.download(filePath);
};

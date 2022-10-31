import config from "@src/config";
import CallTypes from "@src/apps/calls/enums/CallTypes";

import moment = require("moment");
import { Call, Order, User } from "@prisma/client";
import AssignMasterFlow from "@src/apps/telegram/flows/AssignmasterFlow";
import ChangeMasterFlow from "@src/apps/telegram/flows/ChangeMasterFlow";
import db from "@src/db";

export function orderFormMessage(order: Order) {
  const link = `${config.PUBLIC_URL}/order-form?t=${order.id}`;
  const message =
    `Заявка #КБТ${order.id}\n` + `<a href="${link}">Ссылка на форму</a>`;
  return message;
}

export async function orderMessageForDispatcher(order: Order) {
  let message =
    `Заявка #КБТ${order.id}\n\n` +
    `<b>Имя клиента</b>: ${order.clientName}\n` +
    `#СВЯЗЬ${order.clientPhone}\n` +
    `<b>Номер телефона</b>: ${order.clientPhone}\n` +
    `<b>Доп. номер телефона</b>: ${order.additionalPhone}\n` +
    `<b>Дата выезда</b>: ${moment(order.departureDate).format(
      "DD.MM.YYYY HH:mm"
    )}\n` +
    `<b>Адрес</b>: ${order.fullAddress}\n` +
    `<b>Неисправность</b>: ${order.defect}\n` +
    `<b>Марка</b>: ${order.brand}\n` +
    `<b>Модель</b>: ${order.model}\n`;

  if (order.deviceTypeId) {
    const deviceType = await db.deviceType.findUnique({
      where: { id: order.deviceTypeId },
    });
    message += `<b>Тип устройства</b>: ${deviceType.title}\n`;
  }

  if (order.masterId) {
    const master = await db.user.findUnique({
      where: { id: order.masterId },
    });
    message += `\n<b>Статус</b>: Установлена\n`;
    message += `<b>Мастер</b>: ${master.fullName}\n`;
  }

  return message;
}

export async function orderMessageForMaster(order: Order) {
  let message =
    `Заявка #КБТ${order.id}\n\n` +
    `<b>Имя клиента</b>: ${order.clientName}\n` +
    `#СВЯЗЬ${order.clientPhone}\n` +
    `<b>Номер телефона</b>: ${order.clientPhone}\n` +
    `<b>Доп. номер телефона</b>: ${order.additionalPhone}\n` +
    `<b>Дата выезда</b>: ${moment(order.departureDate).format(
      "DD.MM.YYYY HH:mm"
    )}\n` +
    `<b>Адрес</b>: ${order.fullAddress}\n` +
    `<b>Неисправность</b>: ${order.defect}\n` +
    `<b>Марка</b>: ${order.brand}\n` +
    `<b>Модель</b>: ${order.model}\n`;

  if (order.deviceTypeId) {
    const deviceType = await db.deviceType.findUnique({
      where: { id: order.deviceTypeId },
    });
    message += `<b>Тип устройства</b>: ${deviceType.title}\n`;
  }

  return message;
}

export function dispatcherOrderInlineKB(order: Order) {
  let inline_keyboard = [
    [
      {
        text: "Назначить на мастера",
        callback_data: JSON.stringify({
          cmd: `flow:start:${AssignMasterFlow.getKey()}`,
          orderId: order.id,
        }),
      },
    ],
  ];

  if (order.masterId) {
    inline_keyboard = [
      [
        {
          text: "Сменить мастера",
          callback_data: JSON.stringify({
            cmd: `flow:start:${ChangeMasterFlow.getKey()}`,
            orderId: order.id,
          }),
        },
      ],
    ];
  }

  return inline_keyboard;
}

export function callMessage(call: Call) {
  return (
    `${call.type === CallTypes.IN ? "Входящий" : "Исходящий"} звонок\n` +
    `${call.status}\n\n` +
    `<b>Поступил</b>: ${moment(call.date).format("DD.MM.YYYY hh:mm:ss")}\n` +
    `#СВЯЗЬ${call.clientPhone}\n` +
    `<b>Номер</b>: ${call.clientPhone}\n` +
    `<b>Продолжительность</b>: ${call.duration} сек.\n` +
    `<b>Запись</b>: <a href="${call.recordLink}">${call.recordLink}</a>\n`
  );
}

export function callMessagerInlineKeyboard(callId) {
  return [
    [
      {
        text: "Заявка",
        callback_data: JSON.stringify({
          cmd: "order:create",
          callId,
        }),
      },
    ],
    [
      {
        text: "Продажи",
        callback_data: JSON.stringify({
          cmd: "call:sales",
          callId,
        }),
      },
      {
        text: "Спам",
        callback_data: JSON.stringify({
          cmd: "call:spam",
          callId,
        }),
      },
    ],
    [
      {
        text: "Выкуп",
        callback_data: JSON.stringify({
          cmd: "call:payout",
          callId,
        }),
      },
      {
        text: "Сервис",
        callback_data: JSON.stringify({
          cmd: "call:service",
          callId,
        }),
      },
    ],
  ];
}

export default function masterSelectInlineKeyboard(
  order: Order,
  users: User[]
) {
  const inlineKeyboard = [];
  for (let user of users) {
    inlineKeyboard.push([
      {
        text: user.fullName,
        callback_data: JSON.stringify({
          cmd: "order:assignmaster",
          orderId: order.id,
          masterId: user.id,
        }),
      },
    ]);
  }
  return inlineKeyboard;
}

export function masterOrderInlineKeyboard(order: Order) {
  return [
    [
      {
        text: "Выписать гарантию",
        callback_data: JSON.stringify({
          cmd: "order:warranty",
          orderId: order.id,
        }),
      },
    ],
  ];
}

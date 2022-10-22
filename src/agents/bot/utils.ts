import config from "@src/config";
import CallTypes from "@src/apps/calls/enums/CallTypes";

import moment = require("moment");
import { Call, Order, User } from "@prisma/client";

export function orderFormMessage(order: Order) {
  const link = `${config.PUBLIC_URL}/order-form?t=${order.id}`;
  const message =
    `Заявка №${order.id}\n` + `<a href="${link}">Ссылка на форму</a>`;
  return message;
}

export function orderMessageForDispatcher(order) {
  let message =
    `Заявка № ${order.id}\n\n` +
    `<b>Имя клиента</b>: ${order.clientName}\n` +
    `<b>Номер телефона</b>: ${order.clientPhone}\n` +
    `<b>Доп. номер телефона</b>: ${order.additionalPhone}\n` +
    `<b>Адрес</b>: ${order.fullAddress}\n` +
    `<b>Неисправность</b>: ${order.defect}\n` +
    `<b>Марка</b>: ${order.brand}\n` +
    `<b>Модель</b>: ${order.model}\n` +
    `<b>Тип устройства</b>: ${order.deviceType.title}\n`;

  if (order.masterId) {
    message += `\n<b>Мастер</b>: ${order.master.fullName}\n`;
  }
  return message;
}

export function orderMessageForMaster(order) {
  return (
    `Заявка № ${order.id}\n\n` +
    `<b>Имя клиента</b>: ${order.clientName}\n` +
    `<b>Номер телефона</b>: ${order.clientPhone}\n` +
    `<b>Доп. номер телефона</b>: ${order.additionalPhone}\n` +
    `<b>Адрес</b>: ${order.fullAddress}\n` +
    `<b>Неисправность</b>: ${order.defect}\n` +
    `<b>Марка</b>: ${order.brand}\n` +
    `<b>Модель</b>: ${order.model}\n` +
    `<b>Тип устройства</b>: ${order.deviceType.title}\n`
  );
}

export function dispatcherOrderInlineKB(order) {
  let inline_keyboard = [
    [
      {
        text: "Назначить на мастера",
        callback_data: JSON.stringify({
          cmd: "order:setmaster",
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
            cmd: "order:changemaster",
            orderId: order.id,
          }),
        },
      ],
    ];
  }

  return inline_keyboard;
}

export function callMessage(dto: Call) {
  return (
    `${dto.type === CallTypes.IN ? "Входящий" : "Исходящий"} звонок\n\n` +
    `<b>Поступил</b>: ${moment(dto.date).format("DD.MM.YYYY hh:mm:ss")}\n` +
    `<b>Номер</b>: ${dto.clientPhone}\n` +
    `<b>Продолжительность</b>: ${dto.duration} сек.\n` +
    `<b>Запись</b>: <a href="${dto.recordLink}">${dto.recordLink}</a>\n`
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
        }),
      },
      {
        text: "Спам",
        callback_data: JSON.stringify({
          cmd: "call:spam",
        }),
      },
    ],
    [
      {
        text: "Выкуп",
        callback_data: JSON.stringify({
          cmd: "call:payout",
        }),
      },
      {
        text: "Сервис",
        callback_data: JSON.stringify({
          cmd: "call:service",
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
          userId: user.id,
        }),
      },
    ]);
  }
  return inlineKeyboard;
}

import * as moment from 'moment'
import CallRequestDto from './dto/CallRequestDto';
import CallTypes from "./enums/CallTypes";

export function formatCallMessage(dto: CallRequestDto) {
  return (
    `${dto.type === CallTypes.IN ? "Входящий" : "Исходящий"} звонок\n\n` +
    `<b>Поступил</b>: ${moment(dto.timeStart).format(
      "DD.MM.YYYY hh:mm:ss"
    )}\n` +
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
          callId
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

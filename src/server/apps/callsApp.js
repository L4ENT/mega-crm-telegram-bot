import moment from "moment";
import MessagerRepository from "../../repository/messager-repository.js";
import bot from "../../tgbot/index.js";

const CallStatuses = {
  SUCCESS: "SUCCESS",
  MISSED: "MISSED",
  CANCEL: "CANCEL",
  NOTAVAILABLE: "NOTAVAILABLE",
  NOTALLOWED: "NOTALLOWED",
  NOTFOUND: "NOTFOUND",
};

const CallTypes = {
  IN: "IN",
  OUT: "OUT",
};

export class CallRequestDto {
  /**
   * DTO for every Telephone exchange API request
   * @param {string} type - CallTypes
   * @param {string} status - CallStatuses
   * @param {string} clientPhone - Client phone string
   * @param {Date} timeStart - Time when call have been started
   * @param {Number} duration - Call duration in seconds
   * @param {string} callId - Unique call Id from TE API
   * @param {string} recordLink - Link to mp3 with call record
   */
  constructor(
    type,
    status,
    clientPhone,
    timeStart,
    duration,
    callId,
    recordLink
  ) {
    this.type = type;
    this.status = status;
    this.clientPhone = clientPhone;
    this.timeStart = timeStart;
    this.duration = duration;
    this.callId = callId;
    this.recordLink = recordLink;
  }
}

class CallsApp {
  /**
   * Serves every TE API event
   *
   * @param {import('@prisma/client').Prisma} prisma
   */
  constructor(prisma, messager) {
    this.prisma = prisma;
    this.messagerChannelRepository = new MessagerRepository(
      prisma.messagerChannel,
      messager
    );
  }

  /**
   * Serves every TE API event
   *
   * @param {CallRequestDto} dto
   */
  async process(dto) {
    if (dto.type == CallTypes.OUT) {
      await this.sendOutCallChannel(dto);
    }

    if (dto.status == CallStatuses.SUCCESS) {
      await this.sendSuccessChannel(dto);
    }

    if (dto.status == CallStatuses.MISSED) {
      await this.sendMissedChannel(dto);
    }
  }

  /**
   * Sends all out-calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  formatMessage(dto) {
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

  /**
   * Sends all out-calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  async sendOutCallChannel(dto) {
    const channels = await this.messagerChannelRepository.findMany({
      where: {
        labels: {
          some: {
            messagerLabel: {
              code: "CALLS_OUTCOMING",
            },
          },
        },
      },
    });

    const message = this.formatMessage(dto);

    for (let channel of channels) {
      await bot.sendMessage(channel.uid, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Заявка",
                callback_data: JSON.stringify({
                    cmd: "order:create"
                }),
              }
            ],
            [
              {
                text: "Продажи",
                callback_data: JSON.stringify({
                    cmd: "call:sales"
                })
              },
              {
                text: "Спам",
                callback_data: JSON.stringify({
                    cmd: "call:spam"
                }),
              },
            ],
            [
              {
                text: "Выкуп",
                callback_data: JSON.stringify({
                    cmd: "call:payout"
                }),
              },
              {
                text: "Сервис",
                callback_data: JSON.stringify({
                    cmd: "call:service"
                }),
              },
            ],
          ],
        },
      });
    }
  }

  /**
   * Sends success calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  async sendSuccessChannel(dto) {}

  /**
   * Sends missed calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  async sendMissedChannel(dto) {}
}

export default CallsApp;

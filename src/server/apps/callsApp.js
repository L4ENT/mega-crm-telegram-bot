import moment from "moment";
import MessagerRepository from "../../repository/messager-repository";

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

class CallRequestDto {
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
    this.typduratione = duration;
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
    this.prisma = prisma
    this.messagerChannelRepository = new MessagerRepository(prisma.messagerChannel, messager)
  }

  /**
   * Serves every TE API event
   *
   * @param {CallRequestDto} dto
   */
  async process(dto) {
    if (dto.type == CallTypes.OUT) {
      await this.sendOutCallChannelMessage(dto);
    }

    if (dto.status == CallStatuses.SUCCESS) {
      await this.sendSuccessChannelMessage(dto);
    }

    if (dto.status == CallStatuses.MISSED) {
      await this.sendMissedChannelMessage(dto);
    }
  }

  /**
   * Sends all out-calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  async sendOutCallChannel(dto) {
    const channels = await this.messagerChannelRepository.findMany({
        where: {
            channels: {
                some: {
                    messagerChannel: {
                        messagerlabelCode: 'CALLS_OUTCOMING'
                    }
                }
            }
        }
    })
  }

  /**
   * Sends success calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  async sendSuccessChannelMessage(dto) {

  }

  /**
   * Sends missed calls to specified channel
   *
   * @param {CallRequestDto} dto
   */
  async sendMissedChannelMessage(dto) {

  }
}

export default CallsApp;

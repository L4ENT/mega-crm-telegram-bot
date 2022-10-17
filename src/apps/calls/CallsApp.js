import MessagerRepository from "../../repository/messager-repository.js";
import bot from "../../tgbot/index.js";
import ChannelLabels from "../telegram/enums/ChannelLabels.js";
import CallStatuses from "./enums/CallStatuses.js";
import CallTypes from "./enums/CallTypes.js";
import { callMessagerInlineKeyboard, formatCallMessage } from "./utils.js";


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
  async processRequest(dto) {
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
  async sendOutCallChannel(dto) {
    const channels = await this.messagerChannelRepository.findMany({
      where: {
        labels: {
          some: {
            messagerLabel: {
              code: ChannelLabels.CALLS_OUTCOMING,
            },
          },
        },
      },
    });

    const message = formatCallMessage(dto);

    for (let channel of channels) {
      await bot.sendMessage(channel.uid, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: callMessagerInlineKeyboard()
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
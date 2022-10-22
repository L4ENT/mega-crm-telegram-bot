import { Call } from "@prisma/client";
import db from "@src/db";
import CallDto from "@src/dto/CallDto";

export default class CallManager {
  static async createCall(dto: CallDto): Promise<Call> {
    return await db.call.upsert({
      where: {
        callId: dto.callId,
      },
      create: {
        callId: dto.callId,
        clientPhone: dto.clientPhone,
        date: dto.timeStart,
        duration: dto.duration,
        recordLink: dto.recordLink,
        type: dto.type,
        status: dto.status,
      },
      update: {},
    });
  }
}

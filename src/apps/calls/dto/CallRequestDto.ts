
export default class CallRequestDto {
  type: string;
  status: string;
  clientPhone: string;
  timeStart: Date;
  duration: number;
  callId: string;
  recordLink: string;

  constructor(
    type: string,
    status: string,
    clientPhone: string,
    timeStart: Date,
    duration: number,
    callId: string,
    recordLink: string
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

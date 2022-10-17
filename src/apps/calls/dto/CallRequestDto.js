
export default class CallRequestDto {
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

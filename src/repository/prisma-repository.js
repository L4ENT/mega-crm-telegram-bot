export class PrismaRepository {
  /**
   * Handles every Telelegram Bot API event (WebHook)
   *
   * @param {DataModel} prismaModel - Number of times
   */
  constructor(prismaModel) {
    this.prismaModel = prismaModel;
  }

  model() {
    return this.prismaModel;
  }
}

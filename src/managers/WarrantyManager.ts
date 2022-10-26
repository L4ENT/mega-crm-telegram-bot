import config from "@src/config";
import db from "@src/db";

export default class WarrantyManager {
  static async makeFromOrderId(orderId: number) {
    return await db.warranty.upsert({
      where: { orderId },
      create: { orderId },
      update: {}
    });
  }

  static getDownloadLink(warrantyId: number) {
    return `${config.PUBLIC_URL}/download/warranty-${warrantyId}-file.docx`
  }
}

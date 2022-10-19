/*
  Warnings:

  - You are about to drop the column `device_type` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "device_type",
ADD COLUMN     "device_type_id" INTEGER;

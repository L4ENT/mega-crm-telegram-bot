/*
  Warnings:

  - You are about to drop the column `defaultMasterId` on the `device_types` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "device_types" DROP CONSTRAINT "device_types_defaultMasterId_fkey";

-- AlterTable
ALTER TABLE "device_types" DROP COLUMN "defaultMasterId",
ADD COLUMN     "default_master_id" INTEGER;

-- AddForeignKey
ALTER TABLE "device_types" ADD CONSTRAINT "device_types_default_master_id_fkey" FOREIGN KEY ("default_master_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

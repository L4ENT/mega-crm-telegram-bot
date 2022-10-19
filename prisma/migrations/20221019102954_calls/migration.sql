/*
  Warnings:

  - Added the required column `client_phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatuses" ADD VALUE 'CANCELED';
ALTER TYPE "OrderStatuses" ADD VALUE 'UNASSIGNED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "client_phone" VARCHAR(64) NOT NULL,
ALTER COLUMN "client_name" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "additional_phone" DROP NOT NULL,
ALTER COLUMN "full_address" DROP NOT NULL,
ALTER COLUMN "defect" DROP NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "model" DROP NOT NULL,
ALTER COLUMN "device_type" DROP NOT NULL;

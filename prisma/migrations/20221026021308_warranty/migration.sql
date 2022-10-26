/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `warranty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "warranty" DROP CONSTRAINT "warranty_orderId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "warranty_orderId_key" ON "warranty"("orderId");

-- AddForeignKey
ALTER TABLE "warranty" ADD CONSTRAINT "warranty_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `callId` on the `calls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[call_id]` on the table `calls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `call_id` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calls" DROP COLUMN "callId",
ADD COLUMN     "call_id" VARCHAR(128) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "calls_call_id_key" ON "calls"("call_id");

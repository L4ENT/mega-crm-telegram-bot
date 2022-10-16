/*
  Warnings:

  - You are about to drop the column `messagerUserId` on the `messager_chats` table. All the data in the column will be lost.
  - Added the required column `messager_user_id` to the `messager_chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messager_chats" DROP CONSTRAINT "messager_chats_messagerUserId_fkey";

-- AlterTable
ALTER TABLE "messager_chats" DROP COLUMN "messagerUserId",
ADD COLUMN     "messager_user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "messager_chats" ADD CONSTRAINT "messager_chats_messager_user_id_fkey" FOREIGN KEY ("messager_user_id") REFERENCES "messager_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

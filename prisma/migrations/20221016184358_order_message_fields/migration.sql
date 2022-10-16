/*
  Warnings:

  - You are about to drop the column `chatUid` on the `order_messages` table. All the data in the column will be lost.
  - You are about to drop the column `messageUid` on the `order_messages` table. All the data in the column will be lost.
  - You are about to drop the column `messagerChannelId` on the `order_messages` table. All the data in the column will be lost.
  - You are about to drop the column `messagerChatId` on the `order_messages` table. All the data in the column will be lost.
  - Added the required column `chat_uid` to the `order_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_uid` to the `order_messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_messages" DROP CONSTRAINT "order_messages_messagerChannelId_fkey";

-- DropForeignKey
ALTER TABLE "order_messages" DROP CONSTRAINT "order_messages_messagerChatId_fkey";

-- AlterTable
ALTER TABLE "order_messages" DROP COLUMN "chatUid",
DROP COLUMN "messageUid",
DROP COLUMN "messagerChannelId",
DROP COLUMN "messagerChatId",
ADD COLUMN     "chat_uid" TEXT NOT NULL,
ADD COLUMN     "message_uid" TEXT NOT NULL,
ADD COLUMN     "messager_channel_id" INTEGER,
ADD COLUMN     "messager_chat_id" INTEGER;

-- AddForeignKey
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_messager_channel_id_fkey" FOREIGN KEY ("messager_channel_id") REFERENCES "messager_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_messager_chat_id_fkey" FOREIGN KEY ("messager_chat_id") REFERENCES "messager_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

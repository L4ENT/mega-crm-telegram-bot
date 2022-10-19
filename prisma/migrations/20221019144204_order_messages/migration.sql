/*
  Warnings:

  - A unique constraint covering the columns `[orderId,chat_uid,message_uid]` on the table `order_messages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "order_messages_message_uid_chat_uid_orderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "order_messages_orderId_chat_uid_message_uid_key" ON "order_messages"("orderId", "chat_uid", "message_uid");

/*
  Warnings:

  - A unique constraint covering the columns `[message_uid,chat_uid,orderId]` on the table `order_messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_messages_message_uid_chat_uid_orderId_key" ON "order_messages"("message_uid", "chat_uid", "orderId");

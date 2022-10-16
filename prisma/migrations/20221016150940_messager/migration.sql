/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tg_channel` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tg_username` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderStatuses" AS ENUM ('NEW', 'ASSIGNED', 'DONE');

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "tg_channel",
DROP COLUMN "tg_username",
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "Messager" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Messager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messager_users" (
    "id" SERIAL NOT NULL,
    "messagerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "messager_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messager_chats" (
    "id" SERIAL NOT NULL,
    "messagerId" INTEGER NOT NULL,
    "messagerUserId" INTEGER NOT NULL,

    CONSTRAINT "messager_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messager_channels" (
    "id" SERIAL NOT NULL,
    "messagerId" INTEGER NOT NULL,
    "name" TEXT,
    "uid" TEXT NOT NULL,

    CONSTRAINT "messager_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messager_users_channels" (
    "messager_user_id" INTEGER NOT NULL,
    "messager_channel_id" INTEGER NOT NULL,

    CONSTRAINT "messager_users_channels_pkey" PRIMARY KEY ("messager_user_id","messager_channel_id")
);

-- CreateTable
CREATE TABLE "messager_labels" (
    "id" SERIAL NOT NULL,
    "messagerId" INTEGER NOT NULL,
    "name" TEXT,
    "code" VARCHAR(64) NOT NULL,

    CONSTRAINT "messager_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messager_channel_labels" (
    "messager_label_code" TEXT NOT NULL,
    "messager_channel_id" INTEGER NOT NULL,

    CONSTRAINT "messager_channel_labels_pkey" PRIMARY KEY ("messager_label_code","messager_channel_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "additional_phone" VARCHAR(64) NOT NULL,
    "full_address" TEXT NOT NULL,
    "defect" VARCHAR(128) NOT NULL,
    "brand" VARCHAR(128) NOT NULL,
    "model" VARCHAR(128) NOT NULL,
    "device_type" VARCHAR(128) NOT NULL,
    "status" "OrderStatuses" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_messages" (
    "id" SERIAL NOT NULL,
    "messageUid" TEXT NOT NULL,
    "chatUid" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "messagerChannelId" INTEGER NOT NULL,
    "messagerChatId" INTEGER NOT NULL,

    CONSTRAINT "order_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messager_channels_uid_key" ON "messager_channels"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "messager_labels_code_key" ON "messager_labels"("code");

-- AddForeignKey
ALTER TABLE "messager_users" ADD CONSTRAINT "messager_users_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "Messager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_users" ADD CONSTRAINT "messager_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_chats" ADD CONSTRAINT "messager_chats_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "Messager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_chats" ADD CONSTRAINT "messager_chats_messagerUserId_fkey" FOREIGN KEY ("messagerUserId") REFERENCES "messager_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_channels" ADD CONSTRAINT "messager_channels_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "Messager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_users_channels" ADD CONSTRAINT "messager_users_channels_messager_user_id_fkey" FOREIGN KEY ("messager_user_id") REFERENCES "messager_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_users_channels" ADD CONSTRAINT "messager_users_channels_messager_channel_id_fkey" FOREIGN KEY ("messager_channel_id") REFERENCES "messager_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_labels" ADD CONSTRAINT "messager_labels_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "Messager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_channel_labels" ADD CONSTRAINT "messager_channel_labels_messager_label_code_fkey" FOREIGN KEY ("messager_label_code") REFERENCES "messager_labels"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_channel_labels" ADD CONSTRAINT "messager_channel_labels_messager_channel_id_fkey" FOREIGN KEY ("messager_channel_id") REFERENCES "messager_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_messagerChannelId_fkey" FOREIGN KEY ("messagerChannelId") REFERENCES "messager_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_messagerChatId_fkey" FOREIGN KEY ("messagerChatId") REFERENCES "messager_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[uid,messager_id]` on the table `messager_channels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid,messager_id]` on the table `messager_chats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid,messager_id]` on the table `messager_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `messager_chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messager_chats" ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "messager_channels_uid_messager_id_key" ON "messager_channels"("uid", "messager_id");

-- CreateIndex
CREATE UNIQUE INDEX "messager_chats_uid_messager_id_key" ON "messager_chats"("uid", "messager_id");

-- CreateIndex
CREATE UNIQUE INDEX "messager_users_uid_messager_id_key" ON "messager_users"("uid", "messager_id");

/*
  Warnings:

  - You are about to alter the column `uid` on the `messager_channels` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `uid` on the `messager_chats` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `uid` on the `messager_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.

*/
-- AlterTable
ALTER TABLE "messager_channels" ALTER COLUMN "uid" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "messager_chats" ALTER COLUMN "uid" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "messager_users" ALTER COLUMN "uid" SET DATA TYPE VARCHAR(256);

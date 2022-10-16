/*
  Warnings:

  - You are about to drop the column `messagerId` on the `messager_channels` table. All the data in the column will be lost.
  - You are about to drop the column `messagerId` on the `messager_chats` table. All the data in the column will be lost.
  - You are about to drop the column `messagerId` on the `messager_labels` table. All the data in the column will be lost.
  - You are about to drop the column `messagerId` on the `messager_users` table. All the data in the column will be lost.
  - Added the required column `messager_id` to the `messager_channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messager_id` to the `messager_chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messager_id` to the `messager_labels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messager_id` to the `messager_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messager_channels" DROP CONSTRAINT "messager_channels_messagerId_fkey";

-- DropForeignKey
ALTER TABLE "messager_chats" DROP CONSTRAINT "messager_chats_messagerId_fkey";

-- DropForeignKey
ALTER TABLE "messager_labels" DROP CONSTRAINT "messager_labels_messagerId_fkey";

-- DropForeignKey
ALTER TABLE "messager_users" DROP CONSTRAINT "messager_users_messagerId_fkey";

-- AlterTable
ALTER TABLE "messager_channels" DROP COLUMN "messagerId",
ADD COLUMN     "messager_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messager_chats" DROP COLUMN "messagerId",
ADD COLUMN     "messager_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messager_labels" DROP COLUMN "messagerId",
ADD COLUMN     "messager_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messager_users" DROP COLUMN "messagerId",
ADD COLUMN     "messager_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "messager_users" ADD CONSTRAINT "messager_users_messager_id_fkey" FOREIGN KEY ("messager_id") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_chats" ADD CONSTRAINT "messager_chats_messager_id_fkey" FOREIGN KEY ("messager_id") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_channels" ADD CONSTRAINT "messager_channels_messager_id_fkey" FOREIGN KEY ("messager_id") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_labels" ADD CONSTRAINT "messager_labels_messager_id_fkey" FOREIGN KEY ("messager_id") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

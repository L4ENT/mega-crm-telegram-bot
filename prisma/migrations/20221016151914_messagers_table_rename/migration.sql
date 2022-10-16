/*
  Warnings:

  - You are about to drop the `Messager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "messager_channels" DROP CONSTRAINT "messager_channels_messagerId_fkey";

-- DropForeignKey
ALTER TABLE "messager_chats" DROP CONSTRAINT "messager_chats_messagerId_fkey";

-- DropForeignKey
ALTER TABLE "messager_labels" DROP CONSTRAINT "messager_labels_messagerId_fkey";

-- DropForeignKey
ALTER TABLE "messager_users" DROP CONSTRAINT "messager_users_messagerId_fkey";

-- DropTable
DROP TABLE "Messager";

-- CreateTable
CREATE TABLE "messagers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "messagers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messager_users" ADD CONSTRAINT "messager_users_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_chats" ADD CONSTRAINT "messager_chats_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_channels" ADD CONSTRAINT "messager_channels_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_labels" ADD CONSTRAINT "messager_labels_messagerId_fkey" FOREIGN KEY ("messagerId") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

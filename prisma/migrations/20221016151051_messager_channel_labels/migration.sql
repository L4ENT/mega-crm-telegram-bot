/*
  Warnings:

  - You are about to drop the `messager_channel_labels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "messager_channel_labels" DROP CONSTRAINT "messager_channel_labels_messager_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "messager_channel_labels" DROP CONSTRAINT "messager_channel_labels_messager_label_code_fkey";

-- DropTable
DROP TABLE "messager_channel_labels";

-- CreateTable
CREATE TABLE "messager_channels_labels" (
    "messager_label_code" TEXT NOT NULL,
    "messager_channel_id" INTEGER NOT NULL,

    CONSTRAINT "messager_channels_labels_pkey" PRIMARY KEY ("messager_label_code","messager_channel_id")
);

-- AddForeignKey
ALTER TABLE "messager_channels_labels" ADD CONSTRAINT "messager_channels_labels_messager_label_code_fkey" FOREIGN KEY ("messager_label_code") REFERENCES "messager_labels"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messager_channels_labels" ADD CONSTRAINT "messager_channels_labels_messager_channel_id_fkey" FOREIGN KEY ("messager_channel_id") REFERENCES "messager_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "order_messages" ALTER COLUMN "messagerChannelId" DROP NOT NULL,
ALTER COLUMN "messagerChatId" DROP NOT NULL;

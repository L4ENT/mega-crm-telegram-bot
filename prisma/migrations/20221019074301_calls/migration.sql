-- AlterTable
ALTER TABLE "calls" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "record_link" TEXT;

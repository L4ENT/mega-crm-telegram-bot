/*
  Warnings:

  - The `period` column on the `warranty` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "warranty" DROP COLUMN "period",
ADD COLUMN     "period" INTEGER;

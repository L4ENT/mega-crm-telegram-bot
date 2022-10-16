/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `messagers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "messagers_code_key" ON "messagers"("code");

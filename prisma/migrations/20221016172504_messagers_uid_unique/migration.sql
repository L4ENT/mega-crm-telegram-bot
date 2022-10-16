/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `messager_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "messager_users_uid_key" ON "messager_users"("uid");

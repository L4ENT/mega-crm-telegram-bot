-- CreateTable
CREATE TABLE "messager_flows" (
    "id" SERIAL NOT NULL,
    "messager_id" INTEGER NOT NULL,
    "userUid" VARCHAR(256) NOT NULL,
    "chatUid" VARCHAR(256) NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "messager_flows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messager_flows_userUid_chatUid_key" ON "messager_flows"("userUid", "chatUid");

-- AddForeignKey
ALTER TABLE "messager_flows" ADD CONSTRAINT "messager_flows_messager_id_fkey" FOREIGN KEY ("messager_id") REFERENCES "messagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

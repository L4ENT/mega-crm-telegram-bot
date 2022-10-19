-- CreateTable
CREATE TABLE "calls" (
    "id" SERIAL NOT NULL,
    "callId" VARCHAR(128) NOT NULL,
    "client_phone" VARCHAR(128) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(128) NOT NULL,
    "status" VARCHAR(128) NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "calls" ALTER COLUMN "date" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "date" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "warranty" (
    "id" SERIAL NOT NULL,
    "period" TIMESTAMPTZ(3) NOT NULL,
    "typeOfJob" TEXT NOT NULL,
    "sparesPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "workPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "warranty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "warranty" ADD CONSTRAINT "warranty_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

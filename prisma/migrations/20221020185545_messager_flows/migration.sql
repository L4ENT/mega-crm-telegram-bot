-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "master_id" INTEGER;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

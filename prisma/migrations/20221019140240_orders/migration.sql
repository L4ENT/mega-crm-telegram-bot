-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

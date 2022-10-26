-- AlterTable
ALTER TABLE "device_types" ADD COLUMN     "defaultMasterId" INTEGER;

-- AddForeignKey
ALTER TABLE "device_types" ADD CONSTRAINT "device_types_defaultMasterId_fkey" FOREIGN KEY ("defaultMasterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

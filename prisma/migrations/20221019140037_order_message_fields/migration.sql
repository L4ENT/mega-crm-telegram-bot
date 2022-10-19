-- CreateTable
CREATE TABLE "device_types" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,

    CONSTRAINT "device_types_pkey" PRIMARY KEY ("id")
);

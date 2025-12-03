-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mynewschema";

-- CreateEnum
CREATE TYPE "mynewschema"."TypeComponent" AS ENUM ('CPU', 'GPU', 'MEMORY', 'POWER', 'MOTHERBOARD', 'DISK', 'COOLING', 'CASE');

-- CreateEnum
CREATE TYPE "mynewschema"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "mynewschema"."users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "role" "mynewschema"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mynewschema"."Cart" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mynewschema"."Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mynewschema"."Configure" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "socket" TEXT,
    "ddr" TEXT,
    "watt" INTEGER,
    "formFactor" TEXT,
    "price" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Configure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mynewschema"."Component" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "mynewschema"."TypeComponent" NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "images" JSONB,
    "socket" TEXT,
    "ddr" TEXT,
    "watt" INTEGER,
    "formFactor" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 5,
    "power" TEXT,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mynewschema"."component_on_configure" (
    "id" SERIAL NOT NULL,
    "configureId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "component_on_configure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mynewschema"."Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "mynewschema"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "component_on_configure_configureId_componentId_key" ON "mynewschema"."component_on_configure"("configureId", "componentId");

-- AddForeignKey
ALTER TABLE "mynewschema"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "mynewschema"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mynewschema"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "mynewschema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mynewschema"."Configure" ADD CONSTRAINT "Configure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "mynewschema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mynewschema"."component_on_configure" ADD CONSTRAINT "component_on_configure_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "mynewschema"."Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mynewschema"."component_on_configure" ADD CONSTRAINT "component_on_configure_configureId_fkey" FOREIGN KEY ("configureId") REFERENCES "mynewschema"."Configure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mynewschema"."Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "mynewschema"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mynewschema"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "mynewschema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

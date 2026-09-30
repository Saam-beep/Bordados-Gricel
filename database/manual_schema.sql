-- Esquema de referencia para Bordados Gricel CRM.
-- Recomendación: para el proyecto real usa `npx prisma migrate dev --name init`.

CREATE TYPE "Role" AS ENUM ('CLIENT','ADMIN','SALES','PRODUCTION');
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED','DESIGN_REVIEW','QUOTE_SENT','WAITING_APPROVAL','APPROVED','WAITING_DEPOSIT','IN_PRODUCTION','QUALITY_CONTROL','READY','DELIVERED','CANCELLED');
CREATE TYPE "ServiceType" AS ENUM ('FLAT_EMBROIDERY','EMBROIDERY_3D','APPLIQUE_EMBROIDERY','PATCHES','SUBLIMATION','FULL_SUBLIMATION','GARMENT_MAKING','UNIFORMS','TSHIRTS','OTHER');

CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CLIENT',
  "phone" TEXT,
  "whatsapp" TEXT,
  "company" TEXT,
  "nit" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
  "id" SERIAL PRIMARY KEY,
  "orderNumber" TEXT NOT NULL UNIQUE,
  "customerId" INTEGER NOT NULL REFERENCES "User"("id"),
  "serviceType" "ServiceType" NOT NULL,
  "product" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "sizes" JSONB,
  "colors" TEXT,
  "notes" TEXT,
  "requestedDate" TIMESTAMP(3),
  "confirmedDate" TIMESTAMP(3),
  "status" "OrderStatus" NOT NULL DEFAULT 'RECEIVED',
  "subtotal" DECIMAL(12,2),
  "total" DECIMAL(12,2),
  "deposit" DECIMAL(12,2),
  "balance" DECIMAL(12,2),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderFile" (
  "id" SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderHistory" (
  "id" SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "status" "OrderStatus" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

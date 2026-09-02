-- AlterTable Organization
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "licenseNumber" TEXT;

-- AlterTable DeedInfo
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "deedSerialNumber" TEXT;

-- CreateTable ContractPrintLayout
CREATE TABLE IF NOT EXISTS "ContractPrintLayout" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "paperWidthMm" DOUBLE PRECISION NOT NULL DEFAULT 297,
    "paperHeightMm" DOUBLE PRECISION NOT NULL DEFAULT 420,
    "fields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractPrintLayout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ContractPrintLayout_organizationId_contractType_key"
  ON "ContractPrintLayout"("organizationId", "contractType");

CREATE INDEX IF NOT EXISTS "ContractPrintLayout_organizationId_idx"
  ON "ContractPrintLayout"("organizationId");

DO $$ BEGIN
  ALTER TABLE "ContractPrintLayout"
    ADD CONSTRAINT "ContractPrintLayout_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

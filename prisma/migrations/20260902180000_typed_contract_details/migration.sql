-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ContractLawyerSide" AS ENUM ('FIRST_PARTY', 'SECOND_PARTY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable Contract
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "contractDate" TEXT;
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "contractTime" TEXT;
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "commissionCityRules" TEXT;
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "commissionFactorNumber" TEXT;
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "firstPartyFactorNumber" TEXT;
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "secondPartyFactorNumber" TEXT;
ALTER TABLE "Contract" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- CreateTable ContractLawyer
CREATE TABLE IF NOT EXISTS "ContractLawyer" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "side" "ContractLawyerSide" NOT NULL,
    "name" TEXT,
    "fatherName" TEXT,
    "identityNumber" TEXT,
    "birthPlace" TEXT,
    "birthDate" TEXT,
    "identityExportPlace" TEXT,
    "nationalCode" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "cause" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractLawyer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ContractLawyer_contractId_side_key"
  ON "ContractLawyer"("contractId", "side");

CREATE INDEX IF NOT EXISTS "ContractLawyer_contractId_idx"
  ON "ContractLawyer"("contractId");

DO $$ BEGIN
  ALTER TABLE "ContractLawyer"
    ADD CONSTRAINT "ContractLawyer_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable SaleContractDetails
CREATE TABLE IF NOT EXISTS "SaleContractDetails" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "shareUnits" DOUBLE PRECISION,
    "pricePerSqm" DECIMAL(18,2),
    "totalAmount" DECIMAL(18,2),
    "totalInWords" TEXT,
    "prePaymentAmount" DECIMAL(18,2),
    "prePaymentChequeNumber" TEXT,
    "prePaymentBankName" TEXT,
    "prePaymentBankBranch" TEXT,
    "remainderAmount" DECIMAL(18,2),
    "voucherRegistrationDate" TEXT,
    "voucherOrganizationNumber" TEXT,
    "deliveryDate" TEXT,
    "cancelationPenalty" TEXT,
    "breachPenalty" TEXT,
    "notaryFeePayer" TEXT,
    "delayPenaltyFirstPartyPerDay" DECIMAL(18,2),
    "delayPenaltySecondPartyPerDay" DECIMAL(18,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleContractDetails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SaleContractDetails_contractId_key"
  ON "SaleContractDetails"("contractId");

DO $$ BEGIN
  ALTER TABLE "SaleContractDetails"
    ADD CONSTRAINT "SaleContractDetails_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable RentContractDetails
CREATE TABLE IF NOT EXISTS "RentContractDetails" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "shareUnits" DOUBLE PRECISION,
    "durationMonths" INTEGER,
    "fromDate" TEXT,
    "toDate" TEXT,
    "monthlyAmount" DECIMAL(18,2),
    "monthlyInWords" TEXT,
    "mortgageAmount" DECIMAL(18,2),
    "mortgageInWords" TEXT,
    "totalInWords" TEXT,
    "prePaymentAmount" DECIMAL(18,2),
    "prePaymentChequeNumber" TEXT,
    "prePaymentBankName" TEXT,
    "prePaymentBankBranch" TEXT,
    "remainderAmount" DECIMAL(18,2),
    "remainderDueDate" TEXT,
    "deliveryDate" TEXT,
    "cancelationPenalty" TEXT,
    "breachPenalty" TEXT,
    "notaryFeePayer" TEXT,
    "delayPenaltyFirstPartyPerDay" DECIMAL(18,2),
    "delayPenaltySecondPartyPerDay" DECIMAL(18,2),
    "propertyOwnerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentContractDetails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RentContractDetails_contractId_key"
  ON "RentContractDetails"("contractId");

DO $$ BEGIN
  ALTER TABLE "RentContractDetails"
    ADD CONSTRAINT "RentContractDetails_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable GoodwillContractDetails
CREATE TABLE IF NOT EXISTS "GoodwillContractDetails" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "shareUnits" DOUBLE PRECISION,
    "pricePerSqm" DECIMAL(18,2),
    "totalAmount" DECIMAL(18,2),
    "prePaymentAmount" DECIMAL(18,2),
    "prePaymentChequeNumber" TEXT,
    "prePaymentBankName" TEXT,
    "prePaymentBankBranch" TEXT,
    "remainderAmount" DECIMAL(18,2),
    "remainderDueDate" TEXT,
    "penaltyAmount" TEXT,
    "deliveryDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodwillContractDetails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GoodwillContractDetails_contractId_key"
  ON "GoodwillContractDetails"("contractId");

DO $$ BEGIN
  ALTER TABLE "GoodwillContractDetails"
    ADD CONSTRAINT "GoodwillContractDetails_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable PreSaleContractDetails
CREATE TABLE IF NOT EXISTS "PreSaleContractDetails" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "renovationCode" TEXT,
    "technicalIdNumber" TEXT,
    "insuranceNumber" TEXT,
    "buildingPermitNumber" TEXT,
    "buildingPermitDate" TEXT,
    "equipped" TEXT,
    "totalFloors" INTEGER,
    "totalUnits" INTEGER,
    "areaSqm" DOUBLE PRECISION,
    "storage" TEXT,
    "orientation" TEXT,
    "parkingNumberAndArea" TEXT,
    "flooringType" TEXT,
    "cabinetAndFaucetType" TEXT,
    "bathroomType" TEXT,
    "switchOutletType" TEXT,
    "entranceDoorType" TEXT,
    "interiorDoorType" TEXT,
    "ceilingPlasterType" TEXT,
    "emergencyWaterSourceType" TEXT,
    "heatingType" TEXT,
    "coolerType" TEXT,
    "intercomType" TEXT,
    "cctv" TEXT,
    "tilingType" TEXT,
    "windowType" TEXT,
    "facadeType" TEXT,
    "parkingFloorWallCover" TEXT,
    "lighting" TEXT,
    "balconyCorridorRailing" TEXT,
    "fireExtinguisher" TEXT,
    "elevator" TEXT,
    "waterMotor" TEXT,
    "utilitiesScore" TEXT,
    "loan" TEXT,
    "loanType" TEXT,
    "loanInstallmentAmount" DECIMAL(18,2),
    "totalAmount" DECIMAL(18,2),
    "totalInWords" TEXT,
    "deliveryDate" TEXT,
    "deedTransferDate" TEXT,
    "selfDeclareFormNumber" TEXT,
    "voucherOrganizationNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreSaleContractDetails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PreSaleContractDetails_contractId_key"
  ON "PreSaleContractDetails"("contractId");

DO $$ BEGIN
  ALTER TABLE "PreSaleContractDetails"
    ADD CONSTRAINT "PreSaleContractDetails_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable MutualRescissionContractDetails
CREATE TABLE IF NOT EXISTS "MutualRescissionContractDetails" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "originalContractNumber" TEXT,
    "originalContractDate" TEXT,
    "originalAgencyName" TEXT,
    "shareUnits" DOUBLE PRECISION,
    "areaSqm" DOUBLE PRECISION,
    "county" TEXT,
    "ownershipNumber" TEXT,
    "aggregationClause" TEXT,
    "deliveryClause" TEXT,
    "price" DECIMAL(18,2),
    "paymentType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutualRescissionContractDetails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MutualRescissionContractDetails_contractId_key"
  ON "MutualRescissionContractDetails"("contractId");

DO $$ BEGIN
  ALTER TABLE "MutualRescissionContractDetails"
    ADD CONSTRAINT "MutualRescissionContractDetails_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable ConstructionJvContractDetails
CREATE TABLE IF NOT EXISTS "ConstructionJvContractDetails" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "propertyDescription" TEXT,
    "shareUnits" DOUBLE PRECISION,
    "areaSqm" DOUBLE PRECISION,
    "totalAmount" DECIMAL(18,2),
    "totalInWords" TEXT,
    "governmentalCosts" DECIMAL(18,2),
    "constructionCosts" DECIMAL(18,2),
    "facilityRightsCosts" DECIMAL(18,2),
    "destructionCost" DECIMAL(18,2),
    "firstPartyShare" TEXT,
    "secondPartyShare" TEXT,
    "startDateInWords" TEXT,
    "endDateInWords" TEXT,
    "costDetailsPrepareDate" TEXT,
    "voucherTransferDate" TEXT,
    "shareUnitsToTransfer" TEXT,
    "delayPenaltyFirstPartyPerDay" DECIMAL(18,2),
    "delayPenaltySecondPartyPerDay" DECIMAL(18,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConstructionJvContractDetails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ConstructionJvContractDetails_contractId_key"
  ON "ConstructionJvContractDetails"("contractId");

DO $$ BEGIN
  ALTER TABLE "ConstructionJvContractDetails"
    ADD CONSTRAINT "ConstructionJvContractDetails_contractId_fkey"
    FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

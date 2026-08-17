/*
  Warnings:

  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `listingType` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('SALE', 'RENT', 'GOODWILL', 'MUTUAL_RESCISSION', 'PRE_SALE', 'CONSTRUCTION_JOINT_VENTURE');

-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('PERSON', 'COMPANY');

-- CreateEnum
CREATE TYPE "ContractPartyRole" AS ENUM ('FIRST_PARTY', 'SECOND_PARTY', 'WITNESS');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_dealId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ClientTag" DROP CONSTRAINT "ClientTag_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientTag" DROP CONSTRAINT "ClientTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyMedia" DROP CONSTRAINT "PropertyMedia_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyTag" DROP CONSTRAINT "PropertyTag_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyTag" DROP CONSTRAINT "PropertyTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropIndex
DROP INDEX "Property_city_status_idx";

-- DropIndex
DROP INDEX "Property_listingType_status_idx";

-- DropIndex
DROP INDEX "Property_price_idx";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "currency",
DROP COLUMN "district",
DROP COLUMN "latitude",
DROP COLUMN "listingType",
DROP COLUMN "longitude",
DROP COLUMN "postalCode",
DROP COLUMN "price",
DROP COLUMN "publishedAt",
DROP COLUMN "status",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "facilities" JSONB;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "organizationId" DROP NOT NULL;

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "ClientTag";

-- DropTable
DROP TABLE "Deal";

-- DropTable
DROP TABLE "PropertyMedia";

-- DropTable
DROP TABLE "PropertyTag";

-- DropTable
DROP TABLE "Tag";

-- DropEnum
DROP TYPE "ActivityStatus";

-- DropEnum
DROP TYPE "ActivityType";

-- DropEnum
DROP TYPE "ClientType";

-- DropEnum
DROP TYPE "DealStage";

-- DropEnum
DROP TYPE "ListingType";

-- DropEnum
DROP TYPE "PropertyStatus";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "details" TEXT,
    "plaque" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeedInfo" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeedInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "PartyType" NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "nationalCode" TEXT,
    "economicCode" TEXT,
    "companyName" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "identityExportPlace" TEXT,
    "fatherName" TEXT,
    "identityNumber" TEXT,
    "gender" "Gender",
    "phone" TEXT,
    "email" TEXT,
    "addressId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "description" TEXT,
    "commissionPercentage" DECIMAL(14,2),
    "commissionAmount" DECIMAL(14,2),
    "taxPercentage" DECIMAL(14,2),
    "taxAmount" DECIMAL(14,2),
    "firstPartyCommissionPercentage" DECIMAL(14,2),
    "firstPartyCommissionAmount" DECIMAL(14,2),
    "secondPartyCommissionPercentage" DECIMAL(14,2),
    "secondPartyCommissionAmount" DECIMAL(14,2),
    "termsAndConditions" JSONB,
    "signedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractParty" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "role" "ContractPartyRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractSignature" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "fileId" TEXT,
    "data" JSONB,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractSignature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_province_city_idx" ON "Address"("province", "city");

-- CreateIndex
CREATE UNIQUE INDEX "DeedInfo_propertyId_key" ON "DeedInfo"("propertyId");

-- CreateIndex
CREATE INDEX "Party_organizationId_idx" ON "Party"("organizationId");

-- CreateIndex
CREATE INDEX "Party_nationalCode_idx" ON "Party"("nationalCode");

-- CreateIndex
CREATE INDEX "Party_economicCode_idx" ON "Party"("economicCode");

-- CreateIndex
CREATE INDEX "Party_addressId_idx" ON "Party"("addressId");

-- CreateIndex
CREATE INDEX "Contract_organizationId_idx" ON "Contract"("organizationId");

-- CreateIndex
CREATE INDEX "Contract_propertyId_idx" ON "Contract"("propertyId");

-- CreateIndex
CREATE INDEX "Contract_createdById_idx" ON "Contract"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_organizationId_contractNumber_key" ON "Contract"("organizationId", "contractNumber");

-- CreateIndex
CREATE INDEX "ContractParty_contractId_idx" ON "ContractParty"("contractId");

-- CreateIndex
CREATE INDEX "ContractParty_partyId_idx" ON "ContractParty"("partyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractParty_contractId_partyId_role_key" ON "ContractParty"("contractId", "partyId", "role");

-- CreateIndex
CREATE INDEX "ContractSignature_contractId_idx" ON "ContractSignature"("contractId");

-- CreateIndex
CREATE INDEX "ContractSignature_partyId_idx" ON "ContractSignature"("partyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractSignature_contractId_partyId_key" ON "ContractSignature"("contractId", "partyId");

-- CreateIndex
CREATE INDEX "Organization_addressId_idx" ON "Organization"("addressId");

-- CreateIndex
CREATE INDEX "Property_addressId_idx" ON "Property"("addressId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeedInfo" ADD CONSTRAINT "DeedInfo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractParty" ADD CONSTRAINT "ContractParty_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractParty" ADD CONSTRAINT "ContractParty_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractSignature" ADD CONSTRAINT "ContractSignature_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractSignature" ADD CONSTRAINT "ContractSignature_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractSignature" ADD CONSTRAINT "ContractSignature_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

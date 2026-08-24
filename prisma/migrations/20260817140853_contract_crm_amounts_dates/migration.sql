-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "depositAmount" DECIMAL(18,2),
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "monthlyAmount" DECIMAL(18,2),
ADD COLUMN     "officialDeedDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "totalAmount" DECIMAL(18,2);

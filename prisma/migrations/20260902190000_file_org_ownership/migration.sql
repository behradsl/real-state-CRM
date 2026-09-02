-- AlterTable
ALTER TABLE "File" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "File" ADD COLUMN "uploadedById" TEXT;

-- Backfill uploader: prefer platform admin, else any user
UPDATE "File" AS f
SET "uploadedById" = COALESCE(
  (SELECT u.id FROM "User" u WHERE u.role = 'ADMIN' AND u."organizationId" IS NULL ORDER BY u."createdAt" ASC LIMIT 1),
  (SELECT u.id FROM "User" u ORDER BY u."createdAt" ASC LIMIT 1)
)
WHERE f."uploadedById" IS NULL;

-- Fail loudly if still null (empty DB with files is unexpected)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "File" WHERE "uploadedById" IS NULL) THEN
    RAISE EXCEPTION 'Cannot backfill File.uploadedById — no users exist';
  END IF;
END $$;

ALTER TABLE "File" ALTER COLUMN "uploadedById" SET NOT NULL;

-- CreateIndex
CREATE INDEX "File_organizationId_idx" ON "File"("organizationId");
CREATE INDEX "File_uploadedById_idx" ON "File"("uploadedById");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable Property: promote facilities JSON to columns
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "water" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "electricity" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "gas" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "telephone" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "parking" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "parkingCount" INTEGER;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "storage" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "storageCount" INTEGER;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "storageArea" DOUBLE PRECISION;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "elevator" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "otherFacilities" JSONB;

-- Migrate known keys from facilities JSON (best-effort)
UPDATE "Property"
SET
  "water" = COALESCE("water", CASE WHEN facilities ? 'water' THEN (facilities->>'water')::boolean ELSE NULL END),
  "electricity" = COALESCE("electricity", CASE WHEN facilities ? 'electricity' THEN (facilities->>'electricity')::boolean ELSE NULL END),
  "gas" = COALESCE("gas", CASE WHEN facilities ? 'gas' THEN (facilities->>'gas')::boolean ELSE NULL END),
  "telephone" = COALESCE("telephone", CASE WHEN facilities ? 'telephone' THEN (facilities->>'telephone')::boolean ELSE NULL END),
  "parking" = COALESCE("parking", CASE WHEN facilities ? 'parking' THEN (facilities->>'parking')::boolean ELSE NULL END),
  "parkingCount" = COALESCE("parkingCount", CASE WHEN facilities ? 'parkingCount' THEN (facilities->>'parkingCount')::integer ELSE NULL END),
  "storage" = COALESCE("storage", CASE WHEN facilities ? 'storage' THEN (facilities->>'storage')::boolean ELSE NULL END),
  "storageCount" = COALESCE("storageCount", CASE WHEN facilities ? 'storageCount' THEN (facilities->>'storageCount')::integer ELSE NULL END),
  "storageArea" = COALESCE("storageArea", CASE WHEN facilities ? 'storageArea' THEN (facilities->>'storageArea')::double precision ELSE NULL END),
  "elevator" = COALESCE("elevator", CASE WHEN facilities ? 'elevator' THEN (facilities->>'elevator')::boolean ELSE NULL END)
WHERE facilities IS NOT NULL;

ALTER TABLE "Property" DROP COLUMN IF EXISTS "facilities";

-- AlterTable DeedInfo: promote data JSON to columns
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "cadastralNumber" TEXT;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "subParcelNumber" TEXT;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "mainParcelNumber" TEXT;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "plotNumber" TEXT;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "cadastralDistrict" TEXT;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "registrationArea" TEXT;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "areaSqm" DOUBLE PRECISION;
ALTER TABLE "DeedInfo" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;

UPDATE "DeedInfo"
SET
  "cadastralNumber" = COALESCE("cadastralNumber", data->>'cadastralNumber'),
  "subParcelNumber" = COALESCE("subParcelNumber", data->>'subParcelNumber'),
  "mainParcelNumber" = COALESCE("mainParcelNumber", data->>'mainParcelNumber'),
  "plotNumber" = COALESCE("plotNumber", data->>'plotNumber'),
  "cadastralDistrict" = COALESCE("cadastralDistrict", data->>'cadastralDistrict'),
  "registrationArea" = COALESCE("registrationArea", data->>'registrationArea'),
  "areaSqm" = COALESCE(
    "areaSqm",
    CASE
      WHEN data ? 'areaSqm' AND (data->>'areaSqm') ~ '^-?[0-9]+(\\.[0-9]+)?$'
      THEN (data->>'areaSqm')::double precision
      ELSE NULL
    END
  ),
  "postalCode" = COALESCE("postalCode", data->>'postalCode')
WHERE data IS NOT NULL;

ALTER TABLE "DeedInfo" DROP COLUMN IF EXISTS "data";

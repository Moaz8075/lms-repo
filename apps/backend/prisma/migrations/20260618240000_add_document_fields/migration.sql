-- CreateEnum
CREATE TYPE "DocumentFileType" AS ENUM ('PDF', 'IMAGE', 'DOC', 'OTHER');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "file_type" "DocumentFileType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN IF NOT EXISTS "category" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "documents" ALTER COLUMN "file_size" SET DEFAULT 0;

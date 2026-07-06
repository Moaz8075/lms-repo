-- AlterTable
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "father_name" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "whatsapp" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "clients_org_phone_unique" ON "clients"("organization_id", "phone");

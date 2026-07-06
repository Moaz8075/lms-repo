-- Drop legacy case diary entries (replaced by read-only agenda view)
DROP TABLE IF EXISTS "case_diaries";

-- Task enums
CREATE TYPE "TaskType" AS ENUM (
  'HEARING',
  'CLIENT_MEETING',
  'DOCUMENT_PREPARATION',
  'COURT_WORK',
  'PERSONAL'
);

CREATE TYPE "TaskStatus" AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

-- Tasks table
CREATE TABLE "tasks" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "case_id" UUID,
  "created_by_id" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "date" DATE NOT NULL,
  "time" VARCHAR(5),
  "type" "TaskType" NOT NULL DEFAULT 'COURT_WORK',
  "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tasks_organization_id_idx" ON "tasks"("organization_id");
CREATE INDEX "tasks_case_id_idx" ON "tasks"("case_id");
CREATE INDEX "tasks_date_idx" ON "tasks"("date");
CREATE INDEX "tasks_org_date_idx" ON "tasks"("organization_id", "date");

ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_created_by_id_fkey"
  FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

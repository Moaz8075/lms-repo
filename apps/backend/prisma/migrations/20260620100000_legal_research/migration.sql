-- Legal Research: library items, legal notes, case references + full-text search

CREATE TABLE "library_items" (
    "id" UUID NOT NULL,
    "organization_id" UUID,
    "title" VARCHAR(500) NOT NULL,
    "citation" VARCHAR(255),
    "court" VARCHAR(255),
    "jurisdiction" VARCHAR(255),
    "year" INTEGER,
    "category" VARCHAR(100),
    "author" VARCHAR(255),
    "pdf_url" VARCHAR(500) NOT NULL,
    "total_pages" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_system_document" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "legal_notes" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "library_item_id" UUID,
    "page_number" INTEGER NOT NULL,
    "selected_text" TEXT NOT NULL,
    "personal_note" TEXT,
    "title" VARCHAR(500) NOT NULL,
    "citation" VARCHAR(255),
    "court" VARCHAR(255),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "search_vector" tsvector,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "case_references" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "legal_note_id" UUID NOT NULL,
    "attached_by_id" UUID NOT NULL,
    "attached_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_references_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "library_items_organization_id_idx" ON "library_items"("organization_id");
CREATE INDEX "library_items_system_idx" ON "library_items"("is_system_document");
CREATE INDEX "library_items_court_idx" ON "library_items"("court");
CREATE INDEX "library_items_category_idx" ON "library_items"("category");

CREATE INDEX "legal_notes_organization_id_idx" ON "legal_notes"("organization_id");
CREATE INDEX "legal_notes_created_by_id_idx" ON "legal_notes"("created_by_id");
CREATE INDEX "legal_notes_library_item_id_idx" ON "legal_notes"("library_item_id");
CREATE INDEX "legal_notes_court_idx" ON "legal_notes"("court");
CREATE INDEX "legal_notes_citation_idx" ON "legal_notes"("citation");
CREATE INDEX "legal_notes_search_vector_idx" ON "legal_notes" USING GIN ("search_vector");

CREATE UNIQUE INDEX "case_references_case_note_unique" ON "case_references"("case_id", "legal_note_id");
CREATE INDEX "case_references_case_id_idx" ON "case_references"("case_id");
CREATE INDEX "case_references_legal_note_id_idx" ON "case_references"("legal_note_id");

ALTER TABLE "library_items" ADD CONSTRAINT "library_items_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "legal_notes" ADD CONSTRAINT "legal_notes_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "legal_notes" ADD CONSTRAINT "legal_notes_created_by_id_fkey"
    FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "legal_notes" ADD CONSTRAINT "legal_notes_library_item_id_fkey"
    FOREIGN KEY ("library_item_id") REFERENCES "library_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "case_references" ADD CONSTRAINT "case_references_case_id_fkey"
    FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_references" ADD CONSTRAINT "case_references_legal_note_id_fkey"
    FOREIGN KEY ("legal_note_id") REFERENCES "legal_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_references" ADD CONSTRAINT "case_references_attached_by_id_fkey"
    FOREIGN KEY ("attached_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Full-text search vector maintenance
CREATE OR REPLACE FUNCTION legal_notes_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.selected_text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.personal_note, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER legal_notes_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, selected_text, personal_note ON legal_notes
FOR EACH ROW EXECUTE FUNCTION legal_notes_search_vector_update();

-- Drop hearing outcome column and enum
ALTER TABLE "hearings" DROP COLUMN "outcome";

DROP TYPE "HearingOutcome";

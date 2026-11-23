ALTER TABLE "User"
ADD COLUMN "goals" "Goal"[] NOT NULL DEFAULT ARRAY['TRACK']::"Goal"[];

-- Preserve the objective already stored for every existing account.
UPDATE "User"
SET "goals" = ARRAY["goal"]::"Goal"[];

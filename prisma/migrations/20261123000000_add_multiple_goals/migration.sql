ALTER TABLE "User"
ADD COLUMN "goals" "Goal"[] NOT NULL DEFAULT ARRAY['TRACK']::"Goal"[];

UPDATE "User"
SET "goals" = ARRAY["goal"]::"Goal"[]
WHERE cardinality("goals") = 0;

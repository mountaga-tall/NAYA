-- Repair accounts that received the new default [TRACK] before the
-- legacy single-goal value was copied into the goals array.
UPDATE "User"
SET "goals" = ARRAY["goal"]::"Goal"[]
WHERE "goal" <> 'TRACK'::"Goal"
  AND "goals" = ARRAY['TRACK'::"Goal"]::"Goal"[];

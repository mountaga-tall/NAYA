-- Baseline for the existing NAYA production schema.
-- This migration is intentionally resolved as applied on an existing database
-- and executed normally only on a new empty database.

CREATE TYPE "Goal" AS ENUM ('TRACK', 'PREVENT', 'CONCEIVE');
CREATE TYPE "Flow" AS ENUM ('LIGHT', 'MEDIUM', 'HEAVY', 'SPOTTING');
CREATE TYPE "Mood" AS ENUM ('CALM', 'HAPPY', 'SAD', 'IRRITABLE', 'ANXIOUS');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "firstName" TEXT,
  "email" TEXT,
  "avgCycleLength" INTEGER NOT NULL DEFAULT 28,
  "avgPeriodLength" INTEGER NOT NULL DEFAULT 5,
  "goal" "Goal" NOT NULL DEFAULT 'TRACK',
  "discreetMode" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Cycle" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Cycle_userId_idx" ON "Cycle"("userId");
CREATE INDEX "Cycle_startDate_idx" ON "Cycle"("startDate");

ALTER TABLE "Cycle"
ADD CONSTRAINT "Cycle_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "DailyLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "logDate" TIMESTAMP(3) NOT NULL,
  "flow" "Flow",
  "symptoms" TEXT[] NOT NULL,
  "mood" "Mood",
  "energy" INTEGER,
  "sleep" INTEGER,
  "discharge" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DailyLog_userId_logDate_key" ON "DailyLog"("userId", "logDate");
CREATE INDEX "DailyLog_userId_idx" ON "DailyLog"("userId");
CREATE INDEX "DailyLog_logDate_idx" ON "DailyLog"("logDate");

ALTER TABLE "DailyLog"
ADD CONSTRAINT "DailyLog_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

export const runtime = "nodejs";

import { getCurrentUser, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";

const symptomLabels: Record<string, string> = {
  HEADACHE: "Maux de tête",
  CRAMPS: "Crampes",
  LOW_BACK_PAIN: "Douleurs lombaires",
  TENDER_BREASTS: "Sensibilité des seins",
};

const moodLabels: Record<string, string> = {
  CALM: "Calme",
  HAPPY: "Heureuse",
  SAD: "Triste",
  IRRITABLE: "Irritable",
  ANXIOUS: "Anxieuse",
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const cycles = await prisma.cycle.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "asc" },
    });
    const logs = await prisma.dailyLog.findMany({
      where: { userId: user.id },
      orderBy: { logDate: "asc" },
    });

    const uniqueCycles = cycles.filter(
      (cycle, index, array) =>
        index === array.findIndex((item) => item.startDate.getTime() === cycle.startDate.getTime())
    );

    const cycleDurations: number[] = [];
    for (let index = 1; index < uniqueCycles.length; index += 1) {
      const previous = uniqueCycles[index - 1];
      const current = uniqueCycles[index];
      const days = Math.round(
        (current.startDate.getTime() - previous.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (days > 0 && days <= 60) cycleDurations.push(days);
    }

    if (cycleDurations.length === 0 && user.avgCycleLength) {
      cycleDurations.push(user.avgCycleLength);
    }

    const averageCycle =
      cycleDurations.length > 0
        ? Math.round(cycleDurations.reduce((total, value) => total + value, 0) / cycleDurations.length)
        : user.avgCycleLength;

    const symptomCounts: Record<string, number> = {};
    for (const log of logs) {
      for (const symptom of log.symptoms ?? []) {
        symptomCounts[symptom] = (symptomCounts[symptom] ?? 0) + 1;
      }
    }

    const symptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({ value, label: symptomLabels[value] ?? value, count }));

    const moodCounts: Record<string, number> = {};
    for (const log of logs) {
      if (log.mood) moodCounts[log.mood] = (moodCounts[log.mood] ?? 0) + 1;
    }

    const moods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: moodLabels[value] ?? value, count }));

    return Response.json(
      {
        configured: true,
        averageCycle,
        averagePeriod: user.avgPeriodLength,
        cycles: cycleDurations.length > 0 ? cycleDurations.slice(-6) : [user.avgCycleLength],
        symptoms,
        moods,
        totalLogs: logs.length,
        message:
          "Ces observations sont basées sur les données renseignées dans Naya. Elles ne constituent pas un diagnostic médical.",
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("GET /api/insights", error);
    return Response.json({ error: "Impossible de récupérer les insights." }, { status: 500 });
  }
}
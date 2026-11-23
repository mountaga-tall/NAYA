export const runtime = "nodejs";

import { getCurrentUser, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";

const symptomLabels: Record<string, string> = {
  HEADACHE: "Maux de tête",
  CRAMPS: "Crampes",
  LOW_BACK_PAIN: "Douleurs lombaires",
  TENDER_BREASTS: "Seins sensibles",
  FATIGUE: "Fatigue",
  BLOATING: "Ballonnements",
  NAUSEA: "Nausées",
  ACNE: "Acné",
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

    const [cycles, logs] = await Promise.all([
      prisma.cycle.findMany({
        where: { userId: user.id },
        orderBy: { startDate: "asc" },
      }),
      prisma.dailyLog.findMany({
        where: { userId: user.id },
        orderBy: { logDate: "asc" },
      }),
    ]);

    const uniqueCycles = cycles.filter(
      (cycle, index, array) =>
        index === array.findIndex((item) =>
          item.startDate.getTime() === cycle.startDate.getTime()
        )
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

    const averageCycle = cycleDurations.length > 0
      ? Math.round(cycleDurations.reduce((total, value) => total + value, 0) / cycleDurations.length)
      : user.avgCycleLength;

    const cycleMin = cycleDurations.length > 0 ? Math.min(...cycleDurations) : null;
    const cycleMax = cycleDurations.length > 0 ? Math.max(...cycleDurations) : null;
    const cycleVariation = cycleMin !== null && cycleMax !== null ? cycleMax - cycleMin : null;

    const symptomCounts: Record<string, number> = {};
    for (const log of logs) {
      for (const symptom of log.symptoms ?? []) {
        symptomCounts[symptom] = (symptomCounts[symptom] ?? 0) + 1;
      }
    }

    const symptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([value, count]) => ({ value, label: symptomLabels[value] ?? value, count }));

    const moodCounts: Record<string, number> = {};
    for (const log of logs) {
      if (log.mood) moodCounts[log.mood] = (moodCounts[log.mood] ?? 0) + 1;
    }

    const moods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: moodLabels[value] ?? value, count }));

    const energyLogs = logs.filter((log) => typeof log.energy === "number");
    const sleepLogs = logs.filter((log) => typeof log.sleep === "number");
    const averageEnergy = energyLogs.length > 0
      ? Math.round((energyLogs.reduce((total, log) => total + (log.energy ?? 0), 0) / energyLogs.length) * 10) / 10
      : null;
    const averageSleep = sleepLogs.length > 0
      ? Math.round((sleepLogs.reduce((total, log) => total + (log.sleep ?? 0), 0) / sleepLogs.length) * 10) / 10
      : null;

    const recentLogs = logs.slice(-180);
    const monthCounts = new Map<string, number>();
    for (const log of recentLogs) {
      const key = String(log.logDate.getUTCFullYear()) + "-" +
        String(log.logDate.getUTCMonth() + 1).padStart(2, "0");
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    }
    const logsByMonth = [...monthCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => {
        const date = new Date(month + "-01T00:00:00.000Z");
        return {
          month: date.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" }),
          count,
        };
      });

    const coverageMessage = cycleDurations.length < 2
      ? "Il faut plusieurs débuts de règles enregistrés pour comparer les durées de cycles. Les valeurs affichées restent des repères."
      : "La variation ci-dessous décrit uniquement les cycles que tu as enregistrés. Elle ne permet pas de poser un diagnostic.";

    return Response.json(
      {
        configured: uniqueCycles.length > 0,
        averageCycle,
        averagePeriod: user.avgPeriodLength,
        cycles: cycleDurations.slice(-6),
        trackedCycleCount: uniqueCycles.length,
        observedCycleCount: cycleDurations.length,
        cycleMin,
        cycleMax,
        cycleVariation,
        symptoms,
        moods,
        averageEnergy,
        averageSleep,
        energyLogCount: energyLogs.length,
        sleepLogCount: sleepLogs.length,
        logsByMonth,
        totalLogs: logs.length,
        message: coverageMessage,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("GET /api/insights", error);
    return Response.json({ error: "Impossible de récupérer les insights." }, { status: 500 });
  }
}

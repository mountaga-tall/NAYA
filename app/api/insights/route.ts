import prisma from "@/lib/prisma";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

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
    const user = await prisma.user.findUnique({
      where: {
        id: DEMO_USER_ID,
      },
    });

    if (!user) {
      return Response.json({
        configured: false,
        cycles: [],
        symptoms: [],
        moods: [],
      });
    }

    const cycles = await prisma.cycle.findMany({
      where: {
        userId: DEMO_USER_ID,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: DEMO_USER_ID,
      },
      orderBy: {
        logDate: "asc",
      },
    });

    const uniqueCycles = cycles.filter(
      (cycle, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.startDate.getTime() ===
            cycle.startDate.getTime()
        )
    );

    const cycleDurations: number[] = [];

    for (let index = 1; index < uniqueCycles.length; index += 1) {
      const previous = uniqueCycles[index - 1];
      const current = uniqueCycles[index];

      const difference =
        current.startDate.getTime() -
        previous.startDate.getTime();

      const days = Math.round(
        difference / (1000 * 60 * 60 * 24)
      );

      if (days > 0 && days <= 60) {
        cycleDurations.push(days);
      }
    }

    if (
      cycleDurations.length === 0 &&
      user.avgCycleLength
    ) {
      cycleDurations.push(user.avgCycleLength);
    }

    const averageCycle =
      cycleDurations.length > 0
        ? Math.round(
            cycleDurations.reduce(
              (total, value) => total + value,
              0
            ) / cycleDurations.length
          )
        : user.avgCycleLength;

    const symptomCounts: Record<string, number> = {};

    for (const log of logs) {
      for (const symptom of log.symptoms ?? []) {
        symptomCounts[symptom] =
          (symptomCounts[symptom] ?? 0) + 1;
      }
    }

    const symptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({
        value,
        label: symptomLabels[value] ?? value,
        count,
      }));

    const moodCounts: Record<string, number> = {};

    for (const log of logs) {
      if (log.mood) {
        moodCounts[log.mood] =
          (moodCounts[log.mood] ?? 0) + 1;
      }
    }

    const moods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({
        value,
        label: moodLabels[value] ?? value,
        count,
      }));

    const chartCycles =
      cycleDurations.length > 0
        ? cycleDurations.slice(-6)
        : [user.avgCycleLength];

    return Response.json({
      configured: true,
      averageCycle,
      averagePeriod: user.avgPeriodLength,
      cycles: chartCycles,
      symptoms,
      moods,
      totalLogs: logs.length,
      message:
        "Ces observations sont basées sur les données renseignées dans Naya. Elles ne constituent pas un diagnostic médical.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Impossible de récupérer les insights.",
      },
      {
        status: 500,
      }
    );
  }
}

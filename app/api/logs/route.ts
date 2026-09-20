import prisma from "@/lib/prisma";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      logDate,
      flow,
      symptoms,
      mood,
      energy,
      sleep,
      discharge,
      notes,
    } = body;

    if (!logDate) {
      return Response.json(
        {
          error: "La date est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.user.upsert({
      where: {
        id: DEMO_USER_ID,
      },
      update: {},
      create: {
        id: DEMO_USER_ID,
        firstName: "Amina",
        avgCycleLength: 28,
        avgPeriodLength: 5,
        goal: "TRACK",
      },
    });

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_logDate: {
          userId: DEMO_USER_ID,
          logDate: new Date(logDate),
        },
      },
      update: {
        flow: flow ?? null,
        symptoms: symptoms ?? [],
        mood: mood ?? null,
        energy: energy ?? null,
        sleep: sleep ?? null,
        discharge: discharge ?? null,
        notes: notes ?? null,
      },
      create: {
        userId: DEMO_USER_ID,
        logDate: new Date(logDate),
        flow: flow ?? null,
        symptoms: symptoms ?? [],
        mood: mood ?? null,
        energy: energy ?? null,
        sleep: sleep ?? null,
        discharge: discharge ?? null,
        notes: notes ?? null,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Suivi enregistré.",
        log,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Impossible d'enregistrer le suivi.",
      },
      {
        status: 500,
      }
    );
  }
}

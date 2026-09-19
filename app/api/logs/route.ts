import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      userId,
      logDate,
      flow,
      symptoms,
      mood,
      energy,
      sleep,
      discharge,
      notes,
    } = body;

    if (!userId || !logDate) {
      return Response.json(
        {
          error: "userId et logDate sont obligatoires.",
        },
        {
          status: 400,
        }
      );
    }

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_logDate: {
          userId,
          logDate: new Date(logDate),
        },
      },
      update: {
        flow,
        symptoms: symptoms ?? [],
        mood,
        energy,
        sleep,
        discharge,
        notes,
      },
      create: {
        userId,
        logDate: new Date(logDate),
        flow,
        symptoms: symptoms ?? [],
        mood,
        energy,
        sleep,
        discharge,
        notes,
      },
    });

    return Response.json(log, {
      status: 200,
    });
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

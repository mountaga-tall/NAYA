import prisma from "@/lib/prisma";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      lastPeriodDate,
      cycleLength,
      goal,
    } = body;

    if (!lastPeriodDate || !cycleLength || !goal) {
      return Response.json(
        {
          error: "Les informations sont incomplètes.",
        },
        {
          status: 400,
        }
      );
    }

    const startDate = new Date(`${lastPeriodDate}T00:00:00`);

    const user = await prisma.user.upsert({
      where: {
        id: DEMO_USER_ID,
      },
      update: {
        avgCycleLength: Number(cycleLength),
        goal,
      },
      create: {
        id: DEMO_USER_ID,
        firstName: "Amina",
        avgCycleLength: Number(cycleLength),
        avgPeriodLength: 5,
        goal,
      },
    });

    await prisma.cycle.updateMany({
      where: {
        userId: DEMO_USER_ID,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const cycle = await prisma.cycle.create({
      data: {
        userId: DEMO_USER_ID,
        startDate,
        isActive: true,
      },
    });

    return Response.json({
      success: true,
      userId: user.id,
      cycleId: cycle.id,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Impossible d'enregistrer l'onboarding.",
      },
      {
        status: 500,
      }
    );
  }
}
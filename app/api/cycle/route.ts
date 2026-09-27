import prisma from "@/lib/prisma";
import {
  getCurrentCycleDay,
  getEstimatedFertileWindow,
  getEstimatedOvulationDate,
  getNextPeriodDate,
} from "@/lib/cycleMath";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: DEMO_USER_ID,
      },
    });

    const cycle = await prisma.cycle.findFirst({
      where: {
        userId: DEMO_USER_ID,
        isActive: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    if (!user || !cycle) {
      return Response.json(
        {
          configured: false,
          message: "Aucun cycle actif n'est configuré.",
        },
        {
          status: 200,
        }
      );
    }

    const cycleStartDate = cycle.startDate;
    const cycleLength = user.avgCycleLength;

    const nextPeriodDate = getNextPeriodDate(
      cycleStartDate,
      cycleLength
    );

    const ovulationDate =
      getEstimatedOvulationDate(nextPeriodDate);

    const fertileWindow =
      getEstimatedFertileWindow(ovulationDate);

    const currentCycleDay =
      getCurrentCycleDay(cycleStartDate);

    const today = new Date();

    const isFertile =
      today >= fertileWindow.start &&
      today <= fertileWindow.end;

    let status = "Cycle en cours";

    if (isFertile) {
      status = "Période fertile estimée";
    } else if (today >= nextPeriodDate) {
      status = "Prochaine période estimée";
    }

    return Response.json({
      configured: true,
      firstName: user.firstName,
      cycleLength,
      currentCycleDay,
      cycleStartDate,
      nextPeriodDate,
      ovulationDate,
      fertileWindow,
      status,
      disclaimer:
        "Les dates affichées sont des estimations et ne constituent pas une méthode contraceptive ni un diagnostic médical.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Impossible de récupérer les données du cycle.",
      },
      {
        status: 500,
      }
    );
  }
}
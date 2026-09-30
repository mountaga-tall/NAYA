export const runtime = "nodejs";

import { getCurrentUser, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  getCurrentCycleDay,
  getEstimatedFertileWindow,
  getEstimatedOvulationDate,
  getNextPeriodDate,
} from "@/lib/cycleMath";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const cycle = await prisma.cycle.findFirst({
      where: { userId: user.id, isActive: true },
      orderBy: { startDate: "desc" },
    });

    if (!cycle) {
      return Response.json(
        { configured: false, message: "Aucun cycle actif n'est configuré." },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const nextPeriodDate = getNextPeriodDate(cycle.startDate, user.avgCycleLength);
    const ovulationDate = getEstimatedOvulationDate(nextPeriodDate);
    const fertileWindow = getEstimatedFertileWindow(ovulationDate);
    const currentCycleDay = getCurrentCycleDay(cycle.startDate);
    const today = new Date();

    const isFertile = today >= fertileWindow.start && today <= fertileWindow.end;
    let status = "Cycle en cours";
    if (isFertile) status = "Période fertile estimée";
    else if (today >= nextPeriodDate) status = "Prochaine période estimée";

    return Response.json(
      {
        configured: true,
        firstName: user.firstName,
        cycleLength: user.avgCycleLength,
        currentCycleDay,
        cycleStartDate: cycle.startDate,
        nextPeriodDate,
        ovulationDate,
        fertileWindow,
        status,
        disclaimer:
          "Les dates affichées sont des estimations et ne constituent pas une méthode contraceptive ni un diagnostic médical.",
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("GET /api/cycle", error);
    return Response.json({ error: "Impossible de récupérer les données du cycle." }, { status: 500 });
  }
}
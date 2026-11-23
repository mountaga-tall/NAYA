export const runtime = "nodejs";

import { getCurrentUser, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  getCurrentCycleDay,
  getEstimatedFertileWindow,
  getEstimatedOvulationDate,
  getNextPeriodDate,
} from "@/lib/cycleMath";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number) {
  const result = startOfUtcDay(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const [cycle, history] = await Promise.all([
      prisma.cycle.findFirst({
        where: { userId: user.id, isActive: true },
        orderBy: { startDate: "desc" },
      }),
      prisma.cycle.findMany({
        where: { userId: user.id },
        orderBy: { startDate: "desc" },
        take: 12,
      }),
    ]);

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
    const today = startOfUtcDay(new Date());

    const isFertile = today >= fertileWindow.start && today <= fertileWindow.end;
    let status = "Cycle en cours";
    if (isFertile) status = "Période fertile estimée";
    else if (today >= startOfUtcDay(nextPeriodDate)) status = "Prochaines règles estimées";

    const daysUntilNextPeriod = Math.round(
      (startOfUtcDay(nextPeriodDate).getTime() - today.getTime()) / DAY_IN_MS
    );
    const currentPeriodEndDate = addUtcDays(cycle.startDate, Math.max(user.avgPeriodLength - 1, 0));
    const nextPeriodEndDate = addUtcDays(nextPeriodDate, Math.max(user.avgPeriodLength - 1, 0));
    const periods = history.slice().reverse().map((item) => {
      const start = startOfUtcDay(item.startDate);
      const end = item.endDate
        ? startOfUtcDay(item.endDate)
        : addUtcDays(start, Math.max(user.avgPeriodLength - 1, 0));
      return {
        start,
        end: end < start ? start : end,
        estimated: !item.endDate,
      };
    });

    const estimatedHistoryCount = history.filter((item) => !item.endDate).length;
    const dataNote = history.length < 3
      ? "Tes estimations resteront approximatives tant que Naya ne disposera pas de plusieurs cycles enregistrés."
      : "Les estimations sont basées sur la durée moyenne renseignée et l’historique disponible.";

    return Response.json(
      {
        configured: true,
        firstName: user.firstName,
        primaryGoal: user.goal,
        goals: user.goals,
        cycleLength: user.avgCycleLength,
        avgPeriodLength: user.avgPeriodLength,
        currentCycleDay,
        cycleStartDate: cycle.startDate,
        currentPeriodEndDate,
        nextPeriodDate,
        nextPeriodEndDate,
        daysUntilNextPeriod,
        cycleProgressPercent: Math.min(100, Math.round((currentCycleDay / user.avgCycleLength) * 100)),
        ovulationDate,
        fertileWindow,
        periods,
        historyCount: history.length,
        estimatedHistoryCount,
        status,
        dataNote,
        disclaimer:
          "Les dates affichées sont des estimations. La fenêtre fertile ne confirme pas une ovulation et ne constitue jamais une méthode contraceptive ni un diagnostic médical.",
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("GET /api/cycle", error);
    return Response.json({ error: "Impossible de récupérer les données du cycle." }, { status: 500 });
  }
}

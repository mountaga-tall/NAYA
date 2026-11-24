export const runtime = "nodejs";

import { getCurrentUser, isSameOrigin, unauthorized } from "@/lib/auth";
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

    const orderedHistory = history
      .slice()
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const uniqueHistory = orderedHistory.filter(
      (item, index, all) => index === 0 || item.startDate.getTime() !== all[index - 1].startDate.getTime()
    );
    const observedCycleLengths: number[] = [];
    for (let index = 1; index < uniqueHistory.length; index += 1) {
      const days = Math.round(
        (uniqueHistory[index].startDate.getTime() - uniqueHistory[index - 1].startDate.getTime()) / DAY_IN_MS
      );
      if (days >= 15 && days <= 60) observedCycleLengths.push(days);
    }
    const recentCycleLengths = observedCycleLengths.slice(-6);
    const predictionCycleLength = recentCycleLengths.length > 0
      ? Math.round(recentCycleLengths.reduce((sum, value) => sum + value, 0) / recentCycleLengths.length)
      : user.avgCycleLength;

    const nextPeriodDate = getNextPeriodDate(cycle.startDate, predictionCycleLength);
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
    const currentPeriodEndDate = cycle.endDate
      ? startOfUtcDay(cycle.endDate)
      : addUtcDays(cycle.startDate, Math.max(user.avgPeriodLength - 1, 0));
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
    const dataNote = observedCycleLengths.length > 0
      ? "Estimation fondée sur " + observedCycleLengths.length + " intervalle(s) entre tes débuts de règles enregistrés. Les cycles peuvent varier."
      : "Pour le moment, Naya utilise la durée moyenne que tu as renseignée. Enregistre plusieurs débuts de règles pour calculer une moyenne observée.";

    return Response.json(
      {
        configured: true,
        firstName: user.firstName,
        primaryGoal: user.goal,
        goals: user.goals,
        cycleLength: predictionCycleLength,
        configuredCycleLength: user.avgCycleLength,
        observedCycleCount: observedCycleLengths.length,
        avgPeriodLength: user.avgPeriodLength,
        currentCycleDay,
        cycleStartDate: cycle.startDate,
        currentPeriodEndDate,
        nextPeriodDate,
        nextPeriodEndDate,
        daysUntilNextPeriod,
        cycleProgressPercent: Math.min(100, Math.round((currentCycleDay / predictionCycleLength) * 100)),
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


function parseCycleDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + "T00:00:00.000Z");
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  const today = startOfUtcDay(new Date());
  return date <= today ? date : null;
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json({ error: "Origine de requête invalide." }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
    }

    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const action = body?.action;
    const date = parseCycleDate(body?.date);
    if (!date) {
      return Response.json({ error: "La date doit être une date réelle, au format AAAA-MM-JJ, qui n'est pas dans le futur." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }
    if (action !== "start_period" && action !== "end_period") {
      return Response.json({ error: "Action de cycle invalide." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }

    if (action === "end_period") {
      const activeCycle = await prisma.cycle.findFirst({
        where: { userId: user.id, isActive: true },
        orderBy: { startDate: "desc" },
      });
      if (!activeCycle) {
        return Response.json({ error: "Aucun cycle actif à mettre à jour." }, { status: 404, headers: { "Cache-Control": "private, no-store" } });
      }
      if (date < startOfUtcDay(activeCycle.startDate)) {
        return Response.json({ error: "La fin des règles ne peut pas précéder leur début." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
      }
      const updated = await prisma.cycle.update({
        where: { id: activeCycle.id },
        data: { endDate: date },
      });
      return Response.json(
        { success: true, action, cycle: updated, message: "Fin des règles enregistrée." },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const latest = await tx.cycle.findFirst({
        where: { userId: user.id },
        orderBy: { startDate: "desc" },
      });
      if (latest && date < startOfUtcDay(latest.startDate)) {
        return { conflict: true as const };
      }

      await tx.cycle.updateMany({
        where: { userId: user.id, isActive: true },
        data: { isActive: false },
      });

      if (latest && date.getTime() === startOfUtcDay(latest.startDate).getTime()) {
        const existing = await tx.cycle.update({
          where: { id: latest.id },
          data: { isActive: true },
        });
        return { cycle: existing, duplicate: true as const };
      }

      const created = await tx.cycle.create({
        data: { userId: user.id, startDate: date, isActive: true },
      });
      return { cycle: created, duplicate: false as const };
    });

    if ("conflict" in result) {
      return Response.json(
        { error: "Cette date précède le dernier début de règles enregistré. Modifie d'abord ton historique ou choisis la date correcte." },
        { status: 409, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    return Response.json(
      { success: true, action, cycle: result.cycle, duplicate: result.duplicate, message: result.duplicate ? "Ce début de règles était déjà enregistré." : "Nouveau cycle enregistré." },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("POST /api/cycle", error);
    return Response.json({ error: "Impossible de mettre à jour le calendrier." }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}

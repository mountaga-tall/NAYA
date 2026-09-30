import { getCurrentUser, isSameOrigin, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";

function getTodayRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return { start, end };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const { start, end } = getTodayRange();
    const log = await prisma.dailyLog.findFirst({
      where: { userId: user.id, logDate: { gte: start, lt: end } },
      orderBy: { logDate: "desc" },
    });

    return Response.json(
      { success: true, log },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("GET /api/logs", error);
    return Response.json({ error: "Impossible de récupérer le suivi du jour." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json(
        { error: "Origine de requête invalide." },
        { status: 403, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const {
      logDate, flow, symptoms, mood, energy, sleep, discharge, notes,
    } = body;

    if (typeof logDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(logDate)) {
      return Response.json(
        { error: "La date est invalide." },
        { status: 400, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const normalizedDate = new Date(`${logDate}T00:00:00.000Z`);
    const allowedFlows = new Set(["LIGHT", "MEDIUM", "HEAVY", "SPOTTING"]);
    const allowedMoods = new Set(["CALM", "HAPPY", "SAD", "IRRITABLE", "ANXIOUS"]);
    const allowedSymptoms = new Set(["HEADACHE", "CRAMPS", "LOW_BACK_PAIN", "TENDER_BREASTS"]);

    if (flow !== null && flow !== undefined && !allowedFlows.has(flow)) {
      return Response.json({ error: "Flux invalide." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }
    if (mood !== null && mood !== undefined && !allowedMoods.has(mood)) {
      return Response.json({ error: "Humeur invalide." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }
    if (
      !Array.isArray(symptoms) ||
      symptoms.length > 20 ||
      symptoms.some((item) => typeof item !== "string" || !allowedSymptoms.has(item))
    ) {
      return Response.json({ error: "Symptômes invalides." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_logDate: {
          userId: user.id,
          logDate: normalizedDate,
        },
      },
      update: {
        flow: flow ?? null,
        symptoms,
        mood: mood ?? null,
        energy: Number.isInteger(energy) && energy >= 0 && energy <= 10 ? energy : null,
        sleep: Number.isInteger(sleep) && sleep >= 0 && sleep <= 24 ? sleep : null,
        discharge: typeof discharge === "string" ? discharge.slice(0, 500) : null,
        notes: typeof notes === "string" ? notes.slice(0, 2000) : null,
      },
      create: {
        userId: user.id,
        logDate: normalizedDate,
        flow: flow ?? null,
        symptoms,
        mood: mood ?? null,
        energy: Number.isInteger(energy) && energy >= 0 && energy <= 10 ? energy : null,
        sleep: Number.isInteger(sleep) && sleep >= 0 && sleep <= 24 ? sleep : null,
        discharge: typeof discharge === "string" ? discharge.slice(0, 500) : null,
        notes: typeof notes === "string" ? notes.slice(0, 2000) : null,
      },
    });

    return Response.json(
      { success: true, message: "Suivi enregistré.", log },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("POST /api/logs", error);
    return Response.json(
      { error: "Impossible d'enregistrer le suivi." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
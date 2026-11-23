export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import {
  createSession,
  hashPassword,
  isValidEmail,
  isSameOrigin,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth";

const goals = ["TRACK", "PREVENT", "CONCEIVE"] as const;

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json(
        { error: "Origine de requête invalide." },
        { status: 403, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const body = await request.json();
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const email = normalizeEmail(body.email);
    const password = body.password;
    const lastPeriodDate = typeof body.lastPeriodDate === "string" ? body.lastPeriodDate : "";
    const cycleLength = Number(body.cycleLength);
    const requestedGoals: unknown = Array.isArray(body.goals) ? body.goals : [body.goal ?? "TRACK"];

    if (!firstName || firstName.length > 80) {
      return Response.json({ error: "Prénom invalide." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }
    if (!isValidEmail(email)) {
      return Response.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (!validatePassword(password)) {
      return Response.json(
        { error: "Le mot de passe doit contenir entre 8 et 128 caractères." },
        { status: 400, headers: { "Cache-Control": "private, no-store" } }
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodDate)) {
      return Response.json({ error: "Date de cycle invalide." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }
    if (!Number.isInteger(cycleLength) || cycleLength < 21 || cycleLength > 35) {
      return Response.json(
        { error: "La durée du cycle doit être comprise entre 21 et 35 jours." },
        { status: 400, headers: { "Cache-Control": "private, no-store" } }
      );
    }
    if (
      !Array.isArray(requestedGoals) ||
      requestedGoals.length === 0 ||
      !requestedGoals.every((value): value is (typeof goals)[number] =>
        typeof value === "string" && goals.includes(value as (typeof goals)[number])
      )
    ) {
      return Response.json({ error: "Choisis au moins un objectif valide." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
    }
    const selectedGoals = [...new Set(requestedGoals)];
    const primaryGoal = selectedGoals[0];

    const startDate = new Date(`${lastPeriodDate}T00:00:00.000Z`);
    if (Number.isNaN(startDate.getTime())) {
      return Response.json({ error: "Date de cycle invalide." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        email,
        passwordHash,
        avgCycleLength: cycleLength,
        goal: primaryGoal,
        goals: selectedGoals,
        cycles: {
          create: { startDate, isActive: true },
        },
      },
    });

    await createSession(user.id);

    return Response.json(
      { success: true, user: { id: user.id, firstName: user.firstName, email: user.email, goal: user.goal, goals: user.goals } },
      { status: 201, headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";

    if (code === "P2002") {
      return Response.json(
        { error: "Un compte existe déjà avec cette adresse email." },
        { status: 409, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    console.error("Registration error", error);
    return Response.json(
      { error: "Impossible de créer le compte." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}

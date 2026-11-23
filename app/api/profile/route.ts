export const runtime = "nodejs";

import { clearCurrentSession, getCurrentUser, isSameOrigin, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";

const validGoals = ["TRACK", "PREVENT", "CONCEIVE"] as const;
type GoalValue = (typeof validGoals)[number];

function validReminderTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    return Response.json(
      {
        success: true,
        profile: {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
          avgCycleLength: user.avgCycleLength,
          avgPeriodLength: user.avgPeriodLength,
          goal: user.goal,
          goals: user.goals,
          discreetMode: user.discreetMode,
          remindersEnabled: user.remindersEnabled,
          reminderTime: user.reminderTime,
        },
        cycles: await prisma.cycle.findMany({
          where: { userId: user.id },
          orderBy: { startDate: "asc" },
        }),
        dailyLogs: await prisma.dailyLog.findMany({
          where: { userId: user.id },
          orderBy: { logDate: "asc" },
        }),
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("GET /api/profile", error);
    return Response.json({ error: "Impossible de récupérer le profil." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
      discreetMode,
      firstName,
      goal,
      goals,
      primaryGoal,
      remindersEnabled,
      reminderTime,
    } = body as {
      discreetMode?: boolean;
      firstName?: string;
      goal?: GoalValue;
      goals?: unknown;
      primaryGoal?: unknown;
      remindersEnabled?: boolean;
      reminderTime?: unknown;
    };

    const data: {
      discreetMode?: boolean;
      firstName?: string;
      goal?: GoalValue;
      goals?: GoalValue[];
      remindersEnabled?: boolean;
      reminderTime?: string;
    } = {};

    if (typeof discreetMode === "boolean") data.discreetMode = discreetMode;

    if (typeof firstName === "string") {
      const normalizedName = firstName.trim();
      if (!normalizedName || normalizedName.length > 80) {
        return Response.json({ error: "Prénom invalide." }, { status: 400 });
      }
      data.firstName = normalizedName;
    }

    if (goals !== undefined) {
      if (!Array.isArray(goals) || goals.length === 0) {
        return Response.json({ error: "Choisis au moins un objectif." }, { status: 400 });
      }

      const selectedGoals = [...new Set(
        goals.filter((value): value is GoalValue =>
          typeof value === "string" && validGoals.includes(value as GoalValue)
        )
      )];

      if (selectedGoals.length !== goals.length) {
        return Response.json({ error: "Un ou plusieurs objectifs sont invalides." }, { status: 400 });
      }

      const selectedPrimary = primaryGoal === undefined
        ? (selectedGoals.includes(user.goal) ? user.goal : selectedGoals[0])
        : primaryGoal;

      if (
        typeof selectedPrimary !== "string" ||
        !validGoals.includes(selectedPrimary as GoalValue) ||
        !selectedGoals.includes(selectedPrimary as GoalValue)
      ) {
        return Response.json({ error: "L’objectif principal doit faire partie des objectifs sélectionnés." }, { status: 400 });
      }

      data.goals = selectedGoals;
      data.goal = selectedPrimary as GoalValue;
    } else if (primaryGoal !== undefined) {
      if (
        typeof primaryGoal !== "string" ||
        !validGoals.includes(primaryGoal as GoalValue) ||
        !user.goals.includes(primaryGoal as GoalValue)
      ) {
        return Response.json({ error: "L’objectif principal doit être sélectionné dans ton profil." }, { status: 400 });
      }
      data.goal = primaryGoal as GoalValue;
    } else if (goal !== undefined) {
      if (!validGoals.includes(goal)) {
        return Response.json({ error: "Objectif invalide." }, { status: 400 });
      }
      data.goal = goal;
      data.goals = [goal];
    }

    if (typeof remindersEnabled === "boolean") {
      data.remindersEnabled = remindersEnabled;
    }

    if (reminderTime !== undefined) {
      if (!validReminderTime(reminderTime)) {
        return Response.json({ error: "Choisis une heure valide au format HH:MM." }, { status: 400 });
      }
      data.reminderTime = reminderTime;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        firstName: true,
        email: true,
        avgCycleLength: true,
        avgPeriodLength: true,
        goal: true,
        goals: true,
        discreetMode: true,
        remindersEnabled: true,
        reminderTime: true,
      },
    });

    return Response.json(
      { success: true, profile: updated },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("PATCH /api/profile", error);
    return Response.json({ error: "Impossible de mettre à jour le profil." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json(
        { error: "Origine de requête invalide." },
        { status: 403, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const user = await getCurrentUser();
    if (!user) return unauthorized();

    await prisma.user.delete({ where: { id: user.id } });
    await clearCurrentSession();

    return Response.json(
      { success: true, message: "Compte et données supprimés." },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("DELETE /api/profile", error);
    return Response.json({ error: "Impossible de supprimer le compte et les données." }, { status: 500 });
  }
}

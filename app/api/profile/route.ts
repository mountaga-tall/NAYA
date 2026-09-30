import { clearCurrentSession, getCurrentUser, unauthorized } from "@/lib/auth";
import prisma from "@/lib/prisma";

const validGoals = ["TRACK", "PREVENT", "CONCEIVE"] as const;
type GoalValue = (typeof validGoals)[number];

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
          discreetMode: user.discreetMode,
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
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { discreetMode, firstName, goal } = body as {
      discreetMode?: boolean;
      firstName?: string;
      goal?: GoalValue;
    };

    const data: {
      discreetMode?: boolean;
      firstName?: string;
      goal?: GoalValue;
    } = {};

    if (typeof discreetMode === "boolean") data.discreetMode = discreetMode;

    if (typeof firstName === "string") {
      const normalizedName = firstName.trim();
      if (!normalizedName || normalizedName.length > 80) {
        return Response.json({ error: "Prénom invalide." }, { status: 400 });
      }
      data.firstName = normalizedName;
    }

    if (goal !== undefined) {
      if (!validGoals.includes(goal)) {
        return Response.json({ error: "Objectif invalide." }, { status: 400 });
      }
      data.goal = goal;
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
        discreetMode: true,
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

export async function DELETE() {
  try {
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

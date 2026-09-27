import prisma from "@/lib/prisma";

const DEMO_USER_ID =
  "00000000-0000-0000-0000-000000000001";

const validGoals = [
  "TRACK",
  "PREVENT",
  "CONCEIVE",
] as const;

type GoalValue = (typeof validGoals)[number];

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: DEMO_USER_ID,
      },
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

    if (!user) {
      return Response.json(
        {
          error: "Utilisateur introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Impossible de récupérer le profil.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const {
      discreetMode,
      firstName,
      goal,
    } = body as {
      discreetMode?: boolean;
      firstName?: string;
      goal?: GoalValue;
    };

    const data: {
      discreetMode?: boolean;
      firstName?: string;
      goal?: GoalValue;
    } = {};

    if (typeof discreetMode === "boolean") {
      data.discreetMode = discreetMode;
    }

    if (typeof firstName === "string") {
      const normalizedName = firstName.trim();

      if (normalizedName) {
        data.firstName = normalizedName;
      }
    }

    if (goal !== undefined) {
      if (!validGoals.includes(goal)) {
        return Response.json(
          {
            error: "Objectif invalide.",
          },
          {
            status: 400,
          }
        );
      }

      data.goal = goal;
    }

    const user = await prisma.user.update({
      where: {
        id: DEMO_USER_ID,
      },
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

    return Response.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Impossible de mettre à jour le profil.",
      },
      {
        status: 500,
      }
    );
  }
}
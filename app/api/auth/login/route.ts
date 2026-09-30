export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import {
  createSession,
  clearLoginFailures,
  isSameOrigin,
  normalizeEmail,
  recordLoginFailure,
  tooManyLoginAttempts,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json(
        { error: "Origine de requête invalide." },
        { status: 403, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const body = await request.json();
    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return Response.json(
        { error: "Email ou mot de passe invalide." },
        { status: 401, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const rate = tooManyLoginAttempts(request, email);
    if (rate.blocked) {
      return Response.json(
        { error: "Trop de tentatives. Réessaie plus tard." },
        {
          status: 429,
          headers: {
            "Cache-Control": "private, no-store",
            "Retry-After": String(rate.retryAfterSeconds),
          },
        }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      recordLoginFailure(request, email);
      return Response.json(
        { error: "Email ou mot de passe invalide." },
        { status: 401, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    clearLoginFailures(request, email);
    await createSession(user.id);

    return Response.json(
      { success: true, user: { id: user.id, firstName: user.firstName, email: user.email } },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Login error", error);
    return Response.json(
      { error: "Impossible de se connecter." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}

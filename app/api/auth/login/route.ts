import prisma from "@/lib/prisma";
import { createSession, normalizeEmail, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return Response.json({ error: "Email ou mot de passe invalide." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json(
        { error: "Email ou mot de passe invalide." },
        { status: 401, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    await createSession(user.id);

    return Response.json(
      { success: true, user: { id: user.id, firstName: user.firstName, email: user.email } },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Login error", error);
    return Response.json({ error: "Impossible de se connecter." }, { status: 500 });
  }
}

export const runtime = "nodejs";

import { clearCurrentSession, isSameOrigin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json(
      { error: "Origine de requête invalide." },
      { status: 403, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  try {
    await clearCurrentSession();
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Logout error", error);
    return Response.json(
      { error: "Impossible de se déconnecter." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}

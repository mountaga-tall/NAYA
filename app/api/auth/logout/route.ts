import { clearCurrentSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearCurrentSession();
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Logout error", error);
    return Response.json({ error: "Impossible de se déconnecter." }, { status: 500 });
  }
}

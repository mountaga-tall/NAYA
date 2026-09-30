import { getCurrentUser, unauthorized } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  return Response.json(
    {
      authenticated: true,
      user: { id: user.id, firstName: user.firstName, email: user.email },
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

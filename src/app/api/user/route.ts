import { NextRequest, NextResponse } from "next/server";

// Thin proxy to aurema-backend's GET /api/user.
// Forwards the Authorization header so the backend can verify the Firebase ID token.
// If the backend is unreachable the activate page falls back to RC getCustomerInfo().
export async function GET(req: NextRequest): Promise<NextResponse> {
  const backendUrl =
    process.env.NEXT_PUBLIC_AUREMA_BACKEND_URL ?? "http://localhost:4000";

  const authHeader = req.headers.get("authorization");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authHeader) headers["Authorization"] = authHeader;

  try {
    const upstream = await fetch(`${backendUrl}/api/user`, {
      headers,
      // Tight timeout so the activate-page poll loop stays responsive.
      signal: AbortSignal.timeout(3000),
    });

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 503 });
  }
}

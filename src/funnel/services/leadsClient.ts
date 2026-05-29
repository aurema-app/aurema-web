const BASE_URL =
  process.env.NEXT_PUBLIC_AUREMA_BACKEND_URL || "http://localhost:3000";

export type LeadPayload = {
  email: string;
  funnelVariant?: string;
};

export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/funnel/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit lead: ${res.status}`);
  }
}

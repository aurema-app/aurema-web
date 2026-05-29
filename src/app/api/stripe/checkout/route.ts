import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

type CheckoutBody = {
  planId: string;
  planLabel: string;
  priceFormatted: string;
  email?: string;
};

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  // No Stripe key — send to our mock checkout page so the user still fills in card
  // details and fires the checkout_submitted event before reaching activate.
  if (!STRIPE_SECRET_KEY) {
    const mockUrl = `${origin}/growth-plan/checkout?plan=${encodeURIComponent(body.planId)}&mock=1`;
    return NextResponse.json({ url: mockUrl });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  // Use a Stripe-hosted price or fall back to a one-time ad-hoc price.
  // In test mode any amount works; the user will see the Stripe test UI.
  const unitAmount = body.planId === "annual" ? 3999 : 999;
  const interval = body.planId === "annual" ? "year" : "month";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: body.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          recurring: { interval },
          product_data: {
            name: `Lexi — ${body.planLabel}`,
            description: "Full situationship analysis + personalized strategy",
          },
          unit_amount: unitAmount,
        },
      },
    ],
    success_url: `${origin}/growth-plan/activate?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(body.planId)}`,
    cancel_url: `${origin}/growth-plan/paywall?cancelled=1`,
    metadata: { source: "lexi-funnel", plan_id: body.planId },
  });

  return NextResponse.json({ url: session.url });
}

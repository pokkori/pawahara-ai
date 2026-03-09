import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://pawahara-ai.vercel.app";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    locale: "ja",
  });

  return NextResponse.json({ url: session.url });
}

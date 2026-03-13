import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function auth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

async function payjpPost(path: string, body: Record<string, string>) {
  const res = await fetch(`${PAYJP_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const { token, plan } = await req.json();
  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  // plan: "light" (¥980/月) or "standard" (¥2,980/月, default)
  // 環境変数: PAYJP_PLAN_ID_LIGHT (ライトプラン) / PAYJP_PLAN_ID (スタンダードプラン)
  const planId = plan === "light"
    ? process.env.PAYJP_PLAN_ID_LIGHT!
    : process.env.PAYJP_PLAN_ID!;

  try {
    // Create customer with card token
    const customer = await payjpPost("/customers", { card: token });
    if (customer.error) {
      return NextResponse.json({ error: customer.error.message }, { status: 400 });
    }

    // Create subscription
    const sub = await payjpPost("/subscriptions", {
      customer: customer.id,
      plan: planId,
    });
    if (sub.error) {
      return NextResponse.json({ error: sub.error.message }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("premium", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 366,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "決済処理に失敗しました" }, { status: 500 });
  }
}

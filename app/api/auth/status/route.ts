import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function auth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

export async function GET() {
  const cookieStore = await cookies();
  const premiumCookie =
    cookieStore.get("premium")?.value === "1" ||
    cookieStore.get("stripe_premium")?.value === "1";

  if (!premiumCookie) {
    return NextResponse.json({ isPremium: false });
  }

  // PAY.JP サブスクリプション検証
  const subId = cookieStore.get("payjp_sub_id")?.value;
  if (!subId || !process.env.PAYJP_SECRET_KEY) {
    // サブスクIDがない場合はcookieのみで判定（一回払い等）
    return NextResponse.json({ isPremium: premiumCookie });
  }

  try {
    const res = await fetch(`${PAYJP_API}/subscriptions/${subId}`, {
      headers: { Authorization: auth() },
      next: { revalidate: 300 }, // 5分キャッシュ
    });

    if (!res.ok) {
      // API エラー時はcookie値をフォールバック
      return NextResponse.json({ isPremium: premiumCookie });
    }

    const sub = await res.json();
    const activeStatuses = ["active", "trial"];
    const isPremium = activeStatuses.includes(sub.status);

    // サブスクが無効ならcookieを削除
    if (!isPremium) {
      const response = NextResponse.json({ isPremium: false });
      response.cookies.set("premium", "", { maxAge: 0, path: "/" });
      response.cookies.set("payjp_sub_id", "", { maxAge: 0, path: "/" });
      return response;
    }

    return NextResponse.json({ isPremium: true });
  } catch {
    // ネットワークエラー時はcookie値をフォールバック
    return NextResponse.json({ isPremium: premiumCookie });
  }
}

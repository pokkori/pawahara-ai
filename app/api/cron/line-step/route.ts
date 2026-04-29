/**
 * LINE ステップ配信 CRON
 * GET /api/cron/line-step
 *
 * Vercel CRON で毎日 09:00 JST（= UTC 00:00）に実行
 * vercel.json に追記が必要:
 *   { "path": "/api/cron/line-step", "schedule": "0 0 * * *" }
 *
 * ステップ定義:
 *   Step 0  → Day0 登録直後（webhook で送信済み）
 *   Step 1  → Day1 フォロー
 *   Step 2  → Day3 有料プラン紹介
 *   Step 3  → Day5 無料体験CTA（再送）
 *   Step 4  → Day7 期間限定オファー
 *   Step 5  → Day10 個別相談CTA
 *   Step 6  → Day14 最終フォロー（完了）
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SERVICE_URL = "https://pawahara-ai.vercel.app";
const SERVICE_NAME = "パワハラ対策AI";
const MONTHLY_PRICE = "¥980";

// -----------------------------------------------------------------------
// ステップ設定
// -----------------------------------------------------------------------
interface StepDef {
  step: number;
  nextStep: number | null; // null = 配信完了
  daysUntilNext: number;
  message: string;
}

const STEPS: StepDef[] = [
  {
    step: 1,
    nextStep: 2,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】昨日のパワハラ相談、問題は解決できましたか？

「上司に怒鳴られた」「無視され続けている」など、状況を入力するだけでAIが対処法を提示します。

何度でも無料でご利用いただけます:
${SERVICE_URL}

解決しない場合は遠慮なくAIに相談してください。`,
  },
  {
    step: 2,
    nextStep: 3,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】から重要なお知らせです。

実際にAIを活用してパワハラを解決された方の声をご紹介します。

「内容証明文のテンプレートをそのまま使ったら、翌週から上司の態度が変わった」（30代 / 製造業）

${SERVICE_NAME}の月額プランなら毎月使い放題で${MONTHLY_PRICE}。
30日間返金保証付きなので、まず試してみてください:
${SERVICE_URL}/pricing`,
  },
  {
    step: 3,
    nextStep: 4,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】無料体験はお試しいただけましたか？

無料プランでも3回まで相談できます。まだの方はこちら:
${SERVICE_URL}

有料プランでは月間相談回数が無制限になります。
証拠収集チェックリストや内容証明文も無制限生成可能です。`,
  },
  {
    step: 4,
    nextStep: 5,
    daysUntilNext: 3,
    message: `【${SERVICE_NAME}】期間限定のご案内です。

今週末まで、月額プランを初月20%OFFでご提供しています。

通常${MONTHLY_PRICE} → 初月 ¥784

この機会にぜひご検討ください:
${SERVICE_URL}/pricing?coupon=LINE20

※クーポンは自動適用されます`,
  },
  {
    step: 5,
    nextStep: 6,
    daysUntilNext: 4,
    message: `【${SERVICE_NAME}】個別のご相談はいかがですか?

「AIの回答だけでは不安」「自分のケースが本当にパワハラか判断したい」という方向けに、専門家への相談窓口もご案内しています。

詳細はこちら:
${SERVICE_URL}/contact`,
  },
  {
    step: 6,
    nextStep: null,
    daysUntilNext: 0,
    message: `【${SERVICE_NAME}】をご利用いただき、ありがとうございます。

引き続きAIをご活用ください。困ったときはいつでもどうぞ:
${SERVICE_URL}

年額プランへの切り替えで2ヶ月分お得になります:
${SERVICE_URL}/pricing`,
  },
];

// -----------------------------------------------------------------------
// LINE Push 送信
// -----------------------------------------------------------------------
async function sendLineMessage(userId: string, text: string): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.error("[LINE-CRON] LINE_CHANNEL_ACCESS_TOKEN 未設定");
    return false;
  }
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }],
    }),
  });
  return res.ok;
}

// -----------------------------------------------------------------------
// CRON ハンドラ
// -----------------------------------------------------------------------
export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();

  // next_send_at が現在以前 かつ step < 6（完了済みを除く）のユーザーを取得
  const { data: users, error } = await supabase
    .from("line_step_users")
    .select("id, line_user_id, step, next_send_at")
    .lte("next_send_at", now.toISOString())
    .lt("step", 6)
    .eq("app_id", "pawahara-ai")
    .order("next_send_at", { ascending: true })
    .limit(200);

  if (error) {
    console.error("[LINE-CRON] Supabase fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { userId: string; step: number; status: string }[] = [];

  for (const user of users ?? []) {
    const currentStep = user.step as number;
    const stepDef = STEPS.find((s) => s.step === currentStep + 1);
    if (!stepDef) continue;

    const sent = await sendLineMessage(user.line_user_id as string, stepDef.message);
    const nextStep = stepDef.nextStep;
    const nextSendAt =
      nextStep !== null && stepDef.daysUntilNext > 0
        ? new Date(now.getTime() + stepDef.daysUntilNext * 86400 * 1000).toISOString()
        : null;

    await supabase
      .from("line_step_users")
      .update({
        step: stepDef.step,
        next_send_at: nextSendAt,
        updated_at: now.toISOString(),
      })
      .eq("id", user.id);

    results.push({
      userId: user.line_user_id as string,
      step: stepDef.step,
      status: sent ? "sent" : "error",
    });
  }

  return NextResponse.json({
    processed: results.length,
    results,
    executedAt: now.toISOString(),
  });
}

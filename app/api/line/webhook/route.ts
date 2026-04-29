/**
 * LINE Messaging API Webhook
 * POST /api/line/webhook
 *
 * 友達追加(follow)イベントを受信 → Day0ウェルカムメッセージを即送信
 * + line_step_users テーブルにユーザーを登録してステップ配信を開始する
 *
 * 環境変数:
 *   LINE_CHANNEL_SECRET      - 署名検証用（LINE Developers > チャンネル基本設定）
 *   LINE_CHANNEL_ACCESS_TOKEN - メッセージ送信用（Messaging API設定 > アクセストークン）
 *   NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY - ユーザー登録用
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SERVICE_URL = "https://pawahara-ai.vercel.app";
const SERVICE_NAME = "パワハラ対策AI";
const APP_ID = "pawahara-ai";

// -----------------------------------------------------------------------
// 署名検証
// -----------------------------------------------------------------------
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) return false;
  const hash = crypto
    .createHmac("SHA256", secret)
    .update(rawBody)
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

// -----------------------------------------------------------------------
// LINE Push メッセージ送信
// -----------------------------------------------------------------------
async function sendLineMessage(userId: string, text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.error("[LINE] LINE_CHANNEL_ACCESS_TOKEN が未設定です");
    return;
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
  if (!res.ok) {
    const err = await res.text();
    console.error(`[LINE] push failed: ${res.status} ${err}`);
  }
}

// -----------------------------------------------------------------------
// Supabase: line_step_users へ登録
// -----------------------------------------------------------------------
async function registerLineUser(userId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const nextSendAt = new Date();
  nextSendAt.setDate(nextSendAt.getDate() + 1); // 次回 = Day1

  const { error } = await supabase.from("line_step_users").upsert(
    {
      line_user_id: userId,
      app_id: APP_ID,
      step: 0,
      next_send_at: nextSendAt.toISOString(),
      created_at: new Date().toISOString(),
    },
    { onConflict: "line_user_id,app_id" }
  );

  if (error) {
    console.error("[LINE] Supabase upsert error:", error.message);
  }
}

// -----------------------------------------------------------------------
// Day0 ウェルカムメッセージ
// -----------------------------------------------------------------------
const DAY0_MESSAGE = `【${SERVICE_NAME}】にご登録ありがとうございます。

職場での出来事を入力するだけで、対処法・証拠収集の手順・内容証明文のテンプレートを即座に提示します。

まず無料でAIをお試しください:
${SERVICE_URL}

何かお困りのことがあれば、いつでもこのLINEにメッセージをどうぞ。`;

// -----------------------------------------------------------------------
// Webhook ハンドラ
// -----------------------------------------------------------------------
export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature") ?? "";

  if (!signature || !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsed: { events?: LineEvent[] };
  try {
    parsed = JSON.parse(rawBody) as { events?: LineEvent[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events = parsed.events ?? [];

  for (const event of events) {
    if (event.type === "follow" && event.source?.userId) {
      const userId = event.source.userId;
      // 並列実行（DB登録失敗でもメッセージは送る）
      await Promise.allSettled([
        sendLineMessage(userId, DAY0_MESSAGE),
        registerLineUser(userId),
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}

// -----------------------------------------------------------------------
// 型定義
// -----------------------------------------------------------------------
interface LineEvent {
  type: string;
  source?: {
    userId?: string;
  };
  replyToken?: string;
}

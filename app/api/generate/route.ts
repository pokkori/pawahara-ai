import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FREE_LIMIT = 3;
const COOKIE_KEY = "claim_use_count";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }
  const isPremium = req.cookies.get("stripe_premium")?.value === "1";
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { industry, situation, claimContent, severity } = body as Record<string, string>;
  if (!claimContent) return NextResponse.json({ error: "クレーム内容は必須です" }, { status: 400 });
  if (claimContent.length > 1000) return NextResponse.json({ error: "クレーム内容は1000文字以内で入力してください" }, { status: 400 });

  const severityGuide = severity === "重大"
    ? "法的リスク・風評被害を考慮し、責任者名義・補償提示を含む最上級の対応文を作成。"
    : severity === "軽微"
    ? "簡潔で温かみのある対応文を作成。過度な謝罪は避ける。"
    : "誠実かつプロフェッショナルな標準的対応文を作成。";

  const prompt = `あなたはクレーム対応の第一人者コンサルタントです。20年の経験を持ち、大手企業のCS部門を指導してきた専門家として、以下のクレームに対する完全な対応セットを作成してください。

【クレーム情報】
業種: ${industry || "一般"}
状況: ${situation || "店舗・サービスへのクレーム"}
クレーム内容: ${claimContent}
深刻度: ${severity || "通常"}

対応方針: ${severityGuide}

以下の構成で出力してください：

---
## 📧 メール返信文（そのまま使えるバージョン）

件名: 【重要】${situation || "ご指摘"}についてのご連絡とお詫び

（宛名）
（本文：お詫び→状況説明→原因→再発防止策→補償・対応→締め→署名欄）

---
## 📞 電話対応スクリプト

**冒頭（第一声）:**
（状況を確認し、謝罪する言葉）

**状況確認フェーズ:**
（お客様の怒りが落ち着いたら確認すべきこと）

**解決提案フェーズ:**
（具体的に提示する内容）

**クロージング:**
（お客様への感謝と今後の関係継続）

---
## ✅ 対応チェックリスト

- [ ] 初動対応（1時間以内にすべきこと）
- [ ] 情報収集と原因確認
- [ ] 再発防止策の実施
- [ ] フォローアップ連絡のタイミング
${severity === "重大" ? "- [ ] 法務・上長への報告\n- [ ] 補償・返金の承認取得" : ""}

---
## 💡 このクレームを顧客満足に変えるポイント

（このクレームをチャンスに変えるための、具体的なアドバイスを2〜3点）

---
※ 実際の状況に応じて文言を調整してご使用ください。`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}

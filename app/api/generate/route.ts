import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;
const COOKIE_KEY = "pawahara_use_count";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }

  const pv = req.cookies.get("premium")?.value;
  const isPremium = pv === "1" || pv === "biz";
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { situation, duration, position, evidence } = body as Record<string, string | string[]>;
  if (!situation || String(situation).trim() === "") {
    return NextResponse.json({ error: "状況を入力してください" }, { status: 400 });
  }

  const evidenceText = Array.isArray(evidence) && evidence.length ? evidence.join("、") : "特になし";
  const durationText = duration ? String(duration).trim() : "不明";
  const positionText = position ? String(position).trim() : "不明";

  const prompt = `あなたは労働問題・ハラスメント対策の専門家AIです。
以下の状況について、5つのセクションで対策書類を作成してください。

【状況】
${situation}

【期間・頻度】
${durationText}

【加害者の役職】
${positionText}

【証拠・記録の状況】
${evidenceText}

---
以下の形式で出力してください（各セクションは必ず ===TAG=== で区切ること）:

=== LEGAL ===
【法的評価】
- パワハラ防止法（労働施策総合推進法）の6類型に照らした判定
- 労働基準法違反の有無（残業未払い・不当解雇など）
- 違反している場合は具体的な条文番号
- 法的に認められやすいポイント・認められにくいポイント
- 総合評価（「明確にパワハラです」「グレーゾーンです」「該当しない可能性があります」など明確に）

=== EVIDENCE ===
【証拠収集チェックリスト】
今日からできること:
- 録音の方法（スマホを使った具体的手順）
- スクリーンショット・印刷で保存すべきもの
- 記録日誌の書き方（日時・場所・発言内容・目撃者）

今週中にやること:
- 診断書取得のタイミングと病院の選び方
- 社内相談窓口への相談記録の残し方

証拠として有効なもの・注意点:
- 有効: 録音・メール・LINE・診断書・日誌・タイムカード
- 改ざん防止の注意点

=== CERTIFIED ===
【内容証明文（全文）】
以下は会社または加害者上司に送る内容証明書の全文です。そのまま使用できる形で作成してください。

令和　　年　　月　　日

[受取人氏名または会社名・代表者名] 殿
[受取人住所]

[差出人氏名]
[差出人住所]

内　容　証　明

（事実の記載・要求事項・回答期限を含む完全な文章）

以上

=== REPORT ===
【相談・申告書ドラフト】
労働基準監督署または都道府県労働局への相談・申告書の記入例を作成してください。

申告者情報（記入例）:
氏名: [氏名]
住所: [住所]
電話番号: [電話番号]
勤務先: [会社名・部署]

申告内容（具体的記述例）:
（状況に基づいた申告内容の記述例を具体的に）

添付書類リスト:
（提出すべき証拠書類のリスト）

提出先・提出方法:
- 管轄の労働基準監督署（会社所在地を管轄する署）
- 総合労働相談コーナー（都道府県労働局）
- 持参 or 郵送可

=== OPTIONS ===
【選択肢マップ】

① 会社と戦う（在職しながら解決）
手順: 内容証明送付 → 労基署・労働局へ申告 → 労働審判（6ヶ月以内）→ 訴訟
費用目安: 弁護士依頼 着手金20〜50万円 / 本人申請 数千円〜
期間目安: 3ヶ月〜2年
回収見込み: 未払い賃金の全額・慰謝料10〜100万円

② 退職して解決する
退職前にやること: 証拠保全・有給消化・離職理由「会社都合」の確認
退職後に請求できるもの: 未払い残業代・慰謝料・失業給付（最大330日）
退職代行サービス: 2〜5万円で即日退職可能

③ 示談・和解で解決する
進め方: 代理人（弁護士）を立てて交渉 or 労働局のあっせん制度を活用
相場: パワハラ 50〜200万円 / 残業未払い 全額+付加金
示談書のポイント: 守秘義務条項・再就職への影響・口外禁止条項の確認

【このケースでのおすすめ】
（上記の状況を踏まえ、最もおすすめの選択肢とその理由を2〜3文で明記）

---
※ 本出力は参考情報であり法的助言ではありません。重要な決断の前には弁護士にご相談ください。`;

  try {
    const client = getClient();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ text, count: newCount });
    if (!isPremium) {
      res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    }
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。" }, { status: 500 });
  }
}

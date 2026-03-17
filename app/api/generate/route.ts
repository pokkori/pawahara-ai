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

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  return _client;
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

  const { situation, duration, position, evidence, severity } = body as Record<string, string | string[]>;
  if (!situation || String(situation).trim() === "") {
    return NextResponse.json({ error: "状況を入力してください" }, { status: 400 });
  }

  const evidenceText = Array.isArray(evidence) && evidence.length ? evidence.join("、") : "特になし";
  const durationText = duration ? String(duration).trim() : "不明";
  const positionText = position ? String(position).trim() : "不明";
  const severityNum = Number(severity) || 3;
  const severityLabel = ["", "軽微（記録・整理段階）", "気になる（証拠収集推奨）", "つらい（内容証明を検討）", "深刻（労基署相談を強く推奨）", "限界（今すぐ弁護士・法テラスへ）"][severityNum] || "不明";

  const prompt = `あなたは労働問題・ハラスメント対策の専門家AIです。社会保険労務士・弁護士との連携実績を持ち、パワハラ防止法（労働施策総合推進法）・労働基準法・労働契約法・民事上の不法行為法理に精通しています。
相談者が一人で抱え込まず、正しい手順で問題を解決できるよう、具体的かつ実践的な対策書類を生成してください。
回答は自然な日本語で、相談者の気持ちに寄り添いながらも、法的根拠に基づいた冷静で頼もしいトーンを心がけてください。

【状況】
${situation}

【期間・頻度】
${durationText}

【加害者の役職】
${positionText}

【証拠・記録の状況】
${evidenceText}

【深刻度（本人申告）】
レベル${severityNum}/5 — ${severityLabel}

---
以下の形式で出力してください（各セクションは必ず ===TAG=== で区切ること）:

=== LEGAL ===
【法的評価】

まず相談者への一言（共感・受け止め・「あなたは悪くない」等を1〜2文で）を書いてから、以下を記載してください。

■ パワハラ防止法（労働施策総合推進法）の6類型に照らした判定
（該当する類型を具体的に明示。例：「①身体的な攻撃」「③人間関係からの切り離し」等）

■ 労働基準法・労働契約法違反の有無
（違反が疑われる場合は条文番号を明記。例：「労働基準法第32条（法定労働時間）違反の可能性」）

■ 法的に認められやすいポイント（この状況の強み）
- （具体的に2〜3点）

■ 法的に認められにくいポイント・注意点（正直に）
- （具体的に1〜2点）

■ 総合評価
「明確にパワハラに該当します」「パワハラのグレーゾーンです」「現時点では証明が難しい状況です」等、明確な判定を1文で述べ、その理由を2〜3文で説明してください。

=== EVIDENCE ===
【証拠収集チェックリスト】

■ 今日できること（今すぐ着手）
- 録音：スマホのボイスメモアプリを常に起動しておく。上着のポケット・胸元に入れておくと自然。【注意】秘密録音は証拠能力があるが、公開・拡散は違法になる場合があるので社外には出さないこと
- スクリーンショット：メール・Slack・LINE等の問題発言を撮影し、日時が分かる形で保存
- 記録日誌：発生日時・場所・発言の逐語録（できるだけ正確に）・目撃者の氏名・自分の体調への影響を毎回記録
- タイムカード・勤怠記録のコピーを取得（残業・休日出勤の証拠）

■ 今週中にやること
- 医療機関受診：精神的ダメージがある場合はすぐに心療内科・精神科を受診し「診断書」を取得（「適応障害」「うつ病」等の診断が証拠として極めて有効）
- 社内相談窓口への相談：相談した記録（日時・対応内容・担当者名）を残す。窓口が機能しない場合もその事実が証拠になる

■ 証拠として特に有効なもの（優先度順）
1. 録音・動画（最も強い証拠）
2. 医師の診断書（精神的損害の証明）
3. メール・チャット・SNSのスクリーンショット
4. 自筆の記録日誌（日付・詳細が明記されたもの）
5. 目撃者の証言（同僚・部下等）
6. タイムカード・給与明細（残業未払いの証明）

■ 改ざん防止・保管の注意
- 証拠はクラウド（Google Drive等）にバックアップ。会社のPCには保存しない
- プリントアウトして日付入りで自宅保管も推奨

=== CERTIFIED ===
【内容証明文（全文）】
会社または加害者上司に送る内容証明書の全文を生成します。そのまま郵便局に持参できる形式で作成してください。
文章は400〜600文字を目安に、事実・要求・期限を明確に記述してください。

令和　　年　　月　　日

[受取人（会社名・代表取締役氏名 または 加害者の役職・氏名）] 殿
〒
[受取人住所]

[差出人氏名]
〒
[差出人住所]
[差出人電話番号]

内　容　証　明

（以下に400〜600文字の内容証明文を生成。含める要素：①事実の経緯（日時・具体的行為を客観的に）②本書面を送付した理由・要求事項（ハラスメントの即時停止・謝罪・損害賠償等）③回答期限（本書面到達後○日以内）④回答なき場合は法的措置を検討する旨）

以上

=== REPORT ===
【相談・申告書ドラフト】
労働基準監督署または都道府県労働局への相談・申告書の記入例を、この状況に合わせて具体的に作成してください。

申告者情報（記入例）:
氏名: [氏名]
住所: 〒[郵便番号] [住所]
電話番号: [電話番号]
勤務先: [会社名・部署・役職]
雇用形態: [正社員 / 契約社員 / パート等]
在職期間: [○年○月〜現在]

申告内容（この状況に基づく具体的記述例）:
（「○年○月頃から、直属の上司である○○（役職）より、以下のような行為を継続的に受けています」と始め、状況の詳細を時系列・5W1Hで具体的に記述。200〜300文字）

要求事項:
- （具体的な要求。例：是正指導の実施・会社への立入調査・未払い残業代の支払い命令等）

添付書類リスト:
- （この状況で提出すべき証拠書類を具体的に列挙）

提出先・提出方法:
- 管轄の労働基準監督署（会社所在地を管轄する署）
- 総合労働相談コーナー（都道府県労働局）
- 持参（予約不要）または郵送可
- 【相談無料・匿名相談も可能】

=== OPTIONS ===
【選択肢マップ】

① 会社と戦う（在職しながら解決）
手順: 社内相談窓口 → 内容証明送付 → 労基署・労働局へ申告 → 労働審判（申立から6ヶ月以内に解決率約70%）→ 訴訟
費用目安: 弁護士依頼 着手金20〜50万円・成功報酬10〜20% / 労働局あっせん 無料 / 本人申請 数千円〜
期間目安: 労働局あっせん1〜3ヶ月 / 労働審判3〜6ヶ月 / 訴訟1〜2年
回収見込み: 未払い賃金の全額 + 付加金（同額）/ 慰謝料10〜300万円（重篤度による）

② 退職して解決する
退職前に必ずやること: 証拠保全完了・有給完全消化・離職理由「会社都合」確認（ハラスメントは「特定受給資格者」に該当し失業給付が有利）
退職後に請求できるもの: 未払い残業代・損害賠償・慰謝料 / 失業給付（最大330日・3ヶ月の給付制限なし）
退職代行サービス: 2〜5万円で即日退職可能。弁護士運営のサービス推奨（交渉・未払い請求も対応）

③ 示談・和解で解決する
進め方: 代理人（弁護士）を立てて直接交渉 / 労働局のあっせん制度（無料・弁護士不要）を活用
相場: パワハラ慰謝料 50〜300万円（重篤度・期間・証拠の強さによる）/ 残業未払い 全額+付加金（最大同額）
示談書の必須確認項目: 守秘義務条項 / 今後の雇用・再就職への影響条項 / 口外禁止条項 / 解決金の税務処理

【このケースでのおすすめ】
（上記の状況・証拠状況・加害者の役職を踏まえ、最もおすすめの選択肢を1つ明示し、その理由と最初に取るべきアクションを3〜4文で具体的に記述してください）

---
※ 本出力は参考情報であり法的助言ではありません。重要な決断の前には弁護士・社会保険労務士にご相談ください。法テラス（0570-078374）では無料相談が利用できます。`;

  try {
    const client = getClient();
    const newCount = cookieCount + 1;
    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 5500,
      messages: [{ role: "user", content: prompt }],
    });

    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-New-Count": String(newCount),
    };
    if (!isPremium) {
      headers["Set-Cookie"] = `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax; HttpOnly; Secure`;
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (err) {
          console.error(err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, { headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。" }, { status: 500 });
  }
}

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import PawaharaChecklist from "@/components/PawaharaChecklist";
import EvidenceTimeline from "@/components/EvidenceTimeline";
import { track } from '@vercel/analytics';

const FREE_LIMIT = 3;
const TABS = ["法的評価", "証拠収集GL", "内容証明文", "申告書", "選択肢マップ"] as const;
type Tab = (typeof TABS)[number];

const TAG_MAP: Record<Tab, string> = {
  "法的評価": "LEGAL",
  "証拠収集GL": "EVIDENCE",
  "内容証明文": "CERTIFIED",
  "申告書": "REPORT",
  "選択肢マップ": "OPTIONS",
};

const PROBLEM_PRESETS = [
  "上司から毎日怒鳴られる・罵倒される",
  "残業代・深夜手当が支払われていない",
  "不当解雇・退職強要をされた",
  "長時間労働・過労が続いている",
  "セクハラを受けた",
  "業務とは無関係な雑用を強制された",
  "同僚からいじめ・無視を受けている",
  "降格・減給を不当に行われた",
  "証拠がないまま泣き寝入りしそうで怖い",
  "メンタルが限界で休職・退職を考えている",
  "SNSや社内チャットで誹謗中傷された",
];

const POSITION_OPTIONS = ["経営者・オーナー", "役員・取締役", "部長・マネージャー", "課長・チームリーダー", "先輩・同僚", "その他"];

const EVIDENCE_OPTIONS = ["録音・録画がある", "メール・LINEのやり取りがある", "日記・メモをつけている", "目撃者がいる", "診断書がある", "何も記録していない"];

const SAMPLE_PREVIEW: Record<Tab, string> = {
  "法的評価": `【法的評価レポート】

■ 判定結果
あなたの状況は「労働施策総合推進法（パワハラ防止法）第30条の2」に定めるパワーハラスメントに該当する可能性が高いと判断されます。

■ 該当する法的根拠
① パワハラ防止法（労働施策総合推進法30条の2）
  → 「優越的関係を背景にした、業務上必要な範囲を超えた言動」に該当
② 民法709条（不法行為）
  → 精神的損害に対する損害賠償請求が可能
③ 会社の安全配慮義務違反（労働契約法5条）
  → 使用者は労働者の心身の安全を確保する義務を負う

■ 重大性の評価
・加害者（部長）は指揮命令権を持つ優越的地位にある ✓
・3ヶ月以上の継続的行為 ✓
・公衆の面前での怒鳴り（精神的苦痛大） ✓
・録音証拠あり → 立証能力「高」 ✓

■ 推奨アクション（優先度順）
1. 録音・記録を継続してバックアップを保存する
2. 内容証明を会社の代表取締役宛に送付
3. 労働基準監督署へ申告（無料）
4. 弁護士無料相談を利用（法テラス: 0570-078374）`,

  "証拠収集GL": `【証拠収集ガイドライン】

■ 今すぐできる証拠収集チェックリスト

□ 録音の強化
・スマートフォンのボイスメモを常時ONにしておく
・「一方的に録音する」行為は原則合法（秘密録音は証拠能力あり）
・ファイルは必ずクラウド（Googleドライブ等）にバックアップ

□ 日記・記録の継続
・日時・場所・発言内容・聴衆者名を記録する
・「毎日15:30、部長室にて『お前は使えない』と言われた」形式
・手書きorデジタル、どちらでも証拠能力あり

□ メール・チャットの保存
・業務連絡で暴言があればスクリーンショットを保存
・外部ストレージかメール転送でバックアップ

□ 医療記録
・不眠・抑うつ症状がある場合は今すぐ受診する
・診断書は最強の証拠のひとつ（会社の因果関係立証に使える）

□ 目撃者
・目撃した同僚の名前と連絡先を控えておく（証言依頼は後でよい）

■ 注意事項
・証拠の改ざんや捏造は絶対にしない（逆効果になる）
・会社の業務システムからデータを無断で持ち出さない`,

  "内容証明文": `【内容証明書 ドラフト】

令和◯年◯月◯日

株式会社○○○○
代表取締役 ○○○○ 殿

送付者：○○○○（あなたの氏名）
所属：○○部

━━━━━━━━━━━━━━━━━━━━
ハラスメント行為の中止及び謝罪を求める通知書
━━━━━━━━━━━━━━━━━━━━

私は、貴社○○部 ○○部長（以下「行為者」）から、令和◯年◯月頃より継続的にパワーハラスメントを受けておりますので、本書面にてその中止及び謝罪を求めます。

【行為の内容】
行為者は、業務上の指導の範囲を著しく超えた言動を繰り返しており、具体的には以下の行為が確認されています。
・「お前は使えない」「クビにするぞ」等の侮辱的発言（日常的）
・他の社員の面前での怒鳴りつけ行為（精神的苦痛大）
・上記行為は令和◯年◯月から現在まで継続中

【法的根拠】
上記行為は労働施策総合推進法第30条の2に定めるパワーハラスメントに該当し、また民法709条に基づく不法行為を構成します。

【要求事項】
1. 本書面受領後、直ちに上記行為を中止すること
2. 書面による謝罪を行うこと
3. 本件について、人事部門を通じた適切な対応を行うこと

本書面到達後2週間以内にご対応がない場合は、労働基準監督署への申告及び法的措置を検討いたします。

以上`,

  "申告書": `【労働基準監督署 申告書（記入例付きドラフト）】

━━━━━━━━━━━━━━━━━━━━
申 告 書
━━━━━━━━━━━━━━━━━━━━

申告日：令和◯年◯月◯日

申告先：○○労働基準監督署 御中

【申告者情報】
氏名：○○○○（あなたの氏名）
住所：○○県○○市○○（自宅住所）
電話：090-XXXX-XXXX
勤務先：株式会社○○○○
所属部署：○○部

【申告内容】
私は、上記勤務先において、上司によるパワーハラスメントを受けており、貴署に調査及び適切な指導を求めるため、本申告書を提出します。

【具体的事実】
・行為者：○○部 ○○部長（60歳代）
・行為期間：令和◯年◯月〜現在（約3ヶ月）
・行為内容：業務時間中、「お前は使えない」「クビにするぞ」等の発言を毎日繰り返し、他の社員の前でも怒鳴りつける行為が継続
・証拠：録音データあり（提出可能）

【求める対応】
1. 事業所への立ち入り調査
2. 行為者及び会社への適切な指導・勧告
3. 再発防止策の実施指導

【添付書類】
□ 録音データの写し（CD-R等）
□ 日記・記録の写し
□ （診断書）※取得済みの場合

申告者署名：_______________`,

  "選択肢マップ": `【選択肢マップ — 3つの道と現実的判断基準】

━━ 選択肢A：会社内で解決（継続勤務） ━━
【手順】 内容証明送付 → 人事部・コンプライアンス窓口に相談 → 改善されなければ労基署
【メリット】 仕事を続けながら解決できる / 退職金・キャリアを守れる
【デメリット】 解決まで精神的ストレスが続く / 改善しない場合もある
【費用】 基本0円（弁護士に頼む場合は相談料3,000〜1万円/時）
【期間】 1〜3ヶ月

━━ 選択肢B：労働基準監督署・行政機関を活用 ━━
【手順】 本申告書で労基署に申告 → 行政による会社への調査・勧告
【メリット】 完全無料 / 行政の権限で動く / 弁護士不要
【デメリット】 時間がかかる（1〜6ヶ月）/ 結果が保証されない
【費用】 0円
【期間】 1〜6ヶ月

━━ 選択肢C：退職・転職を前提とした法的請求 ━━
【手順】 弁護士に依頼 → 損害賠償・未払い賃金請求 → 退職後に解決
【メリット】 精神的に楽になれる / 損害賠償金を得られる可能性
【デメリット】 弁護士費用（着手金30〜50万円）/ 時間（半年〜1年以上）
【費用】 30〜100万円（成功報酬型なら着手金0円の事務所あり）
【期間】 6ヶ月〜1年以上

━━ 今あなたに最も合うのは？ ━━
✅ 録音あり → 証拠力が高い。選択肢B（労基署）から始めるのがコスパ最良
✅ 継続勤務希望 → 選択肢A＋Bの併用
✅ 精神的限界 → まず退職してから選択肢Cへ（体が最優先）`,
};

const FEATURES = [
  { icon: "⚖️", title: "法的評価", desc: "あなたの状況がパワハラ・労働法違反に該当するか法的に判定。どの法律が適用されるかも明示。" },
  { icon: "📋", title: "証拠収集ガイド", desc: "今日からできる証拠の集め方をチェックリスト形式で提供。録音・記録の注意点も解説。" },
  { icon: "✉️", title: "内容証明文の自動生成", desc: "会社・上司への内容証明書をAIが全文作成。参考文として活用できます（送付前に内容をご確認ください）。" },
  { icon: "📄", title: "労基署申告書ドラフト", desc: "労働基準監督署への申告書を自動作成。記入例付きで初めてでも安心。" },
  { icon: "🗺️", title: "選択肢マップ", desc: "戦う・退職・示談それぞれの手順・費用・メリデメをわかりやすく整理。" },
];

const HOW_TO = [
  { step: "1", title: "状況を入力", desc: "受けたハラスメントや労働問題の状況を自由記述。プリセットから選ぶこともできます。" },
  { step: "2", title: "詳細を設定", desc: "期間・加害者の役職・証拠の有無を選択するだけ。入力は2分で完了。" },
  { step: "3", title: "5つの対策書類を受け取る", desc: "法的評価・証拠収集GL・内容証明・申告書・選択肢マップがセットで生成されます。" },
];

const VOICES = [
  { role: "会社員・30代男性", text: "上司から毎日怒鳴られていましたが、自分がパワハラ被害者だと認識できていませんでした。法的評価で「これは違法です」とはっきり書かれて、勇気が出ました。" },
  { role: "パート・40代女性", text: "残業代が3年間ゼロでした。申告書のドラフトをそのまま労基署に持参したら、会社から未払い分が支払われました。" },
  { role: "会社員・20代男性", text: "退職強要をされていて、弁護士に相談しようにも費用が怖くて。内容証明文を送ったら会社側が折れました。弁護士費用ゼロで解決できました。" },
];

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (/^## (.+)$/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line.replace(/^## (.+)$/, '<h3 class="font-bold text-base mt-4 mb-2 text-red-700 border-b border-red-200 pb-1">$1</h3>'));
    } else if (/^# (.+)$/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line.replace(/^# (.+)$/, '<h2 class="font-bold text-lg mt-4 mb-2 text-red-800">$1</h2>'));
    } else if (/^- (.+)$/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push('<div class="mt-2"></div>');
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<p class="text-gray-700 text-sm leading-relaxed">${inner}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

function parseResult(text: string): Record<Tab, string> {
  const result: Partial<Record<Tab, string>> = {};
  for (const tab of TABS) {
    const tag = TAG_MAP[tab];
    const re = new RegExp(`===\\s*${tag}\\s*===([\\s\\S]*?)(?===\\s*\\w+\\s*===|$)`, "i");
    const m = text.match(re);
    result[tab] = m ? m[1].trim() : "";
  }
  return result as Record<Tab, string>;
}

function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("pawahara_usage") ?? "0", 10);
}
function syncUsageCount(serverCount: number): void {
  if (typeof window === "undefined") return;
  // サーバー側cookieカウントを正として同期（シークレット窓回避を防止）
  localStorage.setItem("pawahara_usage", String(serverCount));
}

export default function PawaharaAI() {
  const [situation, setSituation] = useState("");
  const [duration, setDuration] = useState("");
  const [position, setPosition] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<Tab, string> | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("法的評価");
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlan, setPayjpPlan] = useState<"light" | "standard">("standard");
  const [showPaywall, setShowPaywall] = useState(false);
  const [sampleTab, setSampleTab] = useState<Tab>("法的評価");
  const [severity, setSeverity] = useState(3);
  const [showDetails, setShowDetails] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => setIsPremium(d.isPremium))
      .catch(() => {});
    // localStorageから初期値を読み込む（表示用補助）
    setUsageCount(getUsageCount());
  }, []);

  const toggleEvidence = (e: string) => {
    setEvidence((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
  };

  const handlePreset = (p: string) => {
    setSituation((prev) => prev ? prev + "\n" + p : p);
  };

  const startCheckout = (plan: "light" | "standard" = "standard") => {
    setPayjpPlan(plan);
    setShowPaywall(true);
  };

  const handleGenerate = async () => {
    if (!situation.trim()) { setError("状況を入力してください"); return; }
    setError("");
    // ローカルでも簡易チェック（補助的）
    const localCount = getUsageCount();
    if (!isPremium && localCount >= FREE_LIMIT) {
      track('paywall_shown', { service: 'パワハラ対策AI' });
      setShowPaywall(true);
      return;
    }
    track('ai_generated', { service: 'パワハラ対策AI' });
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, duration, position, evidence, severity }),
      });
      // APIが429を返した場合はペイウォール表示（シークレット窓対策）
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "LIMIT_REACHED") {
          track('paywall_shown', { service: 'パワハラ対策AI' });
          setShowPaywall(true);
        } else {
          setError("リクエストが多すぎます。しばらく待ってから再試行してください。");
        }
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("生成に失敗しました");
      if (!res.body) throw new Error("レスポンスボディがありません");

      // サーバー側cookieカウントをlocalStorageに同期（正の値として扱う）
      const newCountHeader = res.headers.get("X-New-Count");
      if (newCountHeader) {
        const newCount = parseInt(newCountHeader, 10);
        if (!isNaN(newCount)) {
          syncUsageCount(newCount);
          setUsageCount(newCount);
        }
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      setResult(parseResult(""));
      setActiveTab("法的評価");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setResult(parseResult(fullText));
      }
      setResult(parseResult(fullText));
    } catch {
      setError("生成中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const copyTab = () => {
    if (result && result[activeTab]) {
      navigator.clipboard.writeText(result[activeTab]);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const lines = [
      "【パワハラ対策AI — 生成結果】",
      `生成日時: ${new Date().toLocaleString("ja-JP")}`,
      "─".repeat(40),
      ...TABS.map((tab) => [
        `\n=== ${tab} ===`,
        result[tab] || "（内容なし）",
      ].join("\n")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `パワハラ対策_書類一式_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    track("download_result", { service: "パワハラ対策AI" });
  };

  return (
    <main className="min-h-screen bg-white">
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-center">プレミアムプランに登録</h2>
            {payjpPlan === "light" ? (
              <KomojuButton planId="light" planLabel="ライトプラン ¥980/月を始める" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
            ) : (
              <KomojuButton planId="standard" planLabel="スタンダードプラン ¥2,980/月を始める" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
            )}
          </div>
        </div>
      )}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h2 className="text-lg font-bold mb-2">状況は変わります。記録は続けてください。</h2>
            <p className="text-sm text-gray-500 mb-4">新たなパワハラが起きるたびに対策書類が必要です。証拠が増えるほど有利になります。</p>
            <div className="space-y-3 mb-4">
              <div className="border border-gray-200 rounded-xl p-4 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 text-sm">ライトプラン</span>
                  <span className="text-red-600 font-bold">¥980/月</span>
                </div>
                <ul className="text-xs text-gray-500 space-y-0.5 mb-3">
                  <li>✅ 法的評価（パワハラ該当判定）</li>
                  <li>✅ 証拠収集ガイドライン</li>
                  <li>✅ 月3回まで</li>
                  <li className="text-gray-400">— 内容証明・申告書はなし</li>
                </ul>
                <button
                  onClick={() => { track('upgrade_click', { service: 'パワハラ対策AI', plan: 'light' }); setPayjpPlan("light"); setShowPaywall(false); setShowPayjp(true); }}
                  className="w-full border border-red-400 text-red-600 font-bold py-2 rounded-lg hover:bg-red-50 text-sm"
                >
                  ライトプランで始める
                </button>
              </div>
              <div className="border-2 border-red-600 rounded-xl p-4 text-left relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">おすすめ</span>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 text-sm">スタンダードプラン</span>
                  <span className="text-red-600 font-bold">¥2,980/月</span>
                </div>
                <ul className="text-xs text-gray-500 space-y-0.5 mb-3">
                  <li>✅ 全機能利用可能</li>
                  <li>✅ 内容証明・労基署申告書</li>
                  <li>✅ 選択肢マップ</li>
                  <li>✅ 無制限利用</li>
                </ul>
                <button
                  onClick={() => { track('upgrade_click', { service: 'パワハラ対策AI', plan: 'standard' }); setPayjpPlan("standard"); setShowPaywall(false); setShowPayjp(true); }}
                  className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  スタンダードで始める
                </button>
              </div>
            </div>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400">閉じる</button>
          </div>
        </div>
      )}
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">🛡️ パワハラ対策AI</span>
          <button
            onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            無料で診断する
          </button>
        </div>
      </nav>

      {/* 免責バナー（目立つ位置） */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center">
        <p className="text-xs text-amber-800 font-medium">
          ⚠️ <strong>本サービスは法的助言・弁護士業務ではありません。</strong>生成された書類は参考情報です。法的手続きには必ず弁護士・労働基準監督署にご相談ください。
        </p>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block bg-red-50 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-red-100">
          🛡️ パワハラ対策AI — 対策書類を15秒で作成
        </div>
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm mb-4 border border-red-200 text-red-700 shadow-sm">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </span>
          <span><strong>7,800人+</strong> が利用・対策書類を作成済み</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          パワハラ・残業未払い・不当解雇<br />
          <span className="text-red-600">対策書類を自分で作る。</span>
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          状況を入力するだけで、内容証明文・労基署申告書・証拠収集ガイドを<strong>30秒で生成</strong>。<br />
          弁護士相談の前段階として、まず自分でできることを把握しましょう。
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-4 py-2">
            <span className="text-red-600 font-bold">5種類</span>
            <span className="text-gray-600">の対策書類を同時生成</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-4 py-2">
            <span className="text-red-600 font-bold">登録不要</span>
            <span className="text-gray-600">すぐに使える</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-4 py-2">
            <span className="text-red-600 font-bold">無料3回</span>
            <span className="text-gray-600">まずお試しください</span>
          </div>
        </div>
        <button
          onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-red-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
        >
          無料3回 — 今すぐ書類を作成する
        </button>
        <div className="flex justify-center gap-8 mt-10 text-sm text-gray-500">
          <span>✅ 登録不要</span>
          <span>✅ 無料3回</span>
          <span>✅ 30秒で生成</span>
        </div>
        </div>
      </section>

      {/* 法的根拠バッジセクション */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">法的根拠に基づいて判定・書類を生成</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { law: "労働施策総合推進法 第30条の2", short: "パワハラ防止法", color: "bg-red-50 border-red-200 text-red-700" },
              { law: "民法 第709条", short: "不法行為・損害賠償", color: "bg-orange-50 border-orange-200 text-orange-700" },
              { law: "労働契約法 第5条", short: "安全配慮義務", color: "bg-amber-50 border-amber-200 text-amber-700" },
              { law: "労働基準法 第104条", short: "労基署申告権", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
              { law: "男女雇用機会均等法 第11条", short: "セクハラ防止義務", color: "bg-pink-50 border-pink-200 text-pink-700" },
            ].map((item) => (
              <div key={item.short} className={`flex flex-col items-center border rounded-xl px-4 py-2.5 ${item.color}`}>
                <span className="text-xs font-bold">{item.short}</span>
                <span className="text-xs opacity-70 mt-0.5">{item.law}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">※ 本サービスの法的評価はこれらの法律に基づいて判定します。弁護士業務ではありません。</p>
        </div>
      </section>

      {/* 厚生労働省パワハラ6類型セクション */}
      <section className="py-14 bg-red-50 border-b border-red-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-red-200">
              <span>🏛️</span>
              <span>厚生労働省 2020年6月施行 パワハラ防止法準拠</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">厚生労働省が定める<span className="text-red-600">パワハラ6類型</span></h2>
            <p className="text-gray-500 text-sm mt-2">あなたが受けている行為は、どの類型に該当しますか？</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: "①",
                title: "身体的な攻撃",
                desc: "暴力・傷害",
                detail: "殴る・蹴る・物を投げつけるなど、身体に危害を加える行為。",
                preset: "上司から暴力・身体的な攻撃を受けた",
                color: "border-red-300 bg-red-50",
                badgeColor: "bg-red-600 text-white",
              },
              {
                num: "②",
                title: "精神的な攻撃",
                desc: "脅迫・侮辱・暴言",
                detail: "「死ね」「クビにする」などの脅し・侮辱・ひどい暴言を繰り返す行為。",
                preset: "上司から毎日怒鳴られる・罵倒される",
                color: "border-orange-300 bg-orange-50",
                badgeColor: "bg-orange-500 text-white",
              },
              {
                num: "③",
                title: "人間関係からの切り離し",
                desc: "隔離・仲間外し",
                detail: "特定の社員を無視・仲間外し・別室に隔離するなど孤立させる行為。",
                preset: "職場で無視・仲間外しされている",
                color: "border-yellow-300 bg-yellow-50",
                badgeColor: "bg-yellow-500 text-white",
              },
              {
                num: "④",
                title: "過大な要求",
                desc: "業務上不要・不可能な要求",
                detail: "明らかに達成不可能なノルマや、業務外の雑用を強制する行為。",
                preset: "業務とは無関係な雑用を強制された",
                color: "border-green-300 bg-green-50",
                badgeColor: "bg-green-600 text-white",
              },
              {
                num: "⑤",
                title: "過小な要求",
                desc: "能力を大きく下回る作業を命じる",
                detail: "管理職を清掃のみに従事させるなど、能力に見合わない作業だけを与える行為。",
                preset: "降格・減給を不当に行われた",
                color: "border-blue-300 bg-blue-50",
                badgeColor: "bg-blue-600 text-white",
              },
              {
                num: "⑥",
                title: "個の侵害",
                desc: "私的なことへの過度な立入り",
                detail: "交友関係・家族・病歴などプライベートへの過度な詮索・干渉。",
                preset: "SNSや社内チャットで誹謗中傷された",
                color: "border-purple-300 bg-purple-50",
                badgeColor: "bg-purple-600 text-white",
              },
            ].map((item) => (
              <div key={item.num} className={`border-2 ${item.color} rounded-2xl p-5 flex flex-col gap-3`}>
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>{item.num}</span>
                  <div>
                    <p className="font-black text-gray-900 text-sm leading-tight">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed flex-1">{item.detail}</p>
                <button
                  onClick={() => {
                    setSituation((prev) => prev ? prev + "\n" + item.preset : item.preset);
                    document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full text-xs font-bold bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  この類型で書類を作成する →
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">出典: 厚生労働省「職場におけるパワーハラスメント対策が事業主の義務になりました！」（2020年6月施行）</p>
          </div>
        </div>
      </section>

      {/* ペルソナ共感セクション */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">こんな状況で困っていませんか？</h2>
          <p className="text-center text-gray-400 text-sm mb-8">職場のハラスメントに悩む方からよく聞く声です</p>
          <div className="space-y-3">
            {[
              "「パワハラを受けているが、これが法的にパワハラに該当するか自分では判断できない」",
              "「弁護士に相談したいが、着手金20〜50万円がかかると聞いて躊躇している」",
              "「証拠を集めたいが、何を・どうやって・どこに保存すればいいかわからない」",
              "「内容証明を送りたいが、書き方がわからないし間違えたら逆に不利になりそうで怖い」",
              "「会社に訴えたいが、報復されるのが怖い。どこに相談すれば安全かわからない」",
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
                <span className="text-red-400 font-bold text-lg mt-0.5 shrink-0">✗</span>
                <p className="text-sm text-gray-700 leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-bold text-base mb-2">パワハラ対策AIが、これら全てを解決します</p>
            <p className="text-sm text-red-700">状況・期間・加害者の役職を入力するだけで、法的評価・内容証明・証拠収集GLが30秒で出力されます。</p>
            <button
              onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block mt-4 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              無料で書類を作成する（3回・登録不要）→
            </button>
          </div>
        </div>
      </section>

      {/* 証拠収集5ステップガイド */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-200">証拠収集ガイド — 今日からできる</div>
            <h2 className="text-2xl font-bold text-gray-900">「証拠が何もない」状態から始める5ステップ</h2>
            <p className="text-gray-500 text-sm mt-2">弁護士に依頼する前に、自分でできる証拠収集の手順を整理しました</p>
          </div>
          <div className="space-y-3">
            {[
              {
                step: "Step 1",
                title: "スマホのボイスメモを常時ONにする",
                detail: "秘密録音は原則合法（証拠能力あり）。「発言日時・場所・内容」が揃えば法廷でも使えます。Googleドライブに自動バックアップ推奨。",
                badge: "今日から",
                badgeColor: "bg-green-100 text-green-700 border-green-200",
              },
              {
                step: "Step 2",
                title: "「パワハラ日誌」を毎日つける",
                detail: "手書き・デジタル問わず証拠能力あり。フォーマット: 「[日時] [場所] [発言者] [発言内容そのまま] [目撃者名]」の5項目を必ず記録。",
                badge: "今日から",
                badgeColor: "bg-green-100 text-green-700 border-green-200",
              },
              {
                step: "Step 3",
                title: "メール・チャットをスクリーンショット保存",
                detail: "暴言・不当指示のあるSlack/LINE/メールは即スクショ→外部ストレージに保存。会社支給PCのデータを無断コピーは避けること。",
                badge: "今日から",
                badgeColor: "bg-green-100 text-green-700 border-green-200",
              },
              {
                step: "Step 4",
                title: "体調不良があれば今すぐ受診",
                detail: "抑うつ・不眠・PTSD症状がある場合は受診して診断書を取得。「業務起因性」を示す最強の証拠になります。受診前にパワハラ状況を医師に伝えること。",
                badge: "重要",
                badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
              },
              {
                step: "Step 5",
                title: "本サービスで証拠記録タイムラインを作成",
                detail: "日時・内容・証拠種別・深刻度を記録できるタイムライン機能を無料で利用できます。テキスト出力で弁護士・労基署への提出書類にそのまま活用できます。",
                badge: "AIで自動化",
                badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs text-blue-600 font-bold">{item.step}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800 font-bold mb-1">証拠収集に今すぐ取り組みましょう</p>
            <p className="text-xs text-blue-700 mb-3">まず状況を入力してAIに証拠収集ガイドラインを生成させてください。あなたの状況に特化した手順が届きます。</p>
            <button
              onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              証拠収集ガイドを今すぐ生成する（無料）→
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">生成される5つの対策書類</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-bold text-gray-900 mb-2">{f.title}</div>
                <div className="text-sm text-gray-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 弁護士 vs AI 比較表 */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="inline-block bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">費用・手間を比較</div>
          <h2 className="text-2xl font-bold text-gray-900">弁護士 vs パワハラ対策AI</h2>
          <p className="text-gray-500 text-sm mt-2">まず自分でできることを把握してから、必要に応じて弁護士へ</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-5 py-3 font-bold text-gray-700 rounded-tl-xl border border-gray-200">項目</th>
                <th className="text-center px-5 py-3 font-bold text-gray-500 border border-gray-200">弁護士</th>
                <th className="text-center px-5 py-3 font-bold text-red-600 bg-red-50 rounded-tr-xl border border-red-200">パワハラ対策AI</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-5 py-3 text-gray-700 border border-gray-200">初回相談料</td>
                <td className="px-5 py-3 text-center text-gray-500 border border-gray-200">¥5,000〜¥10,000</td>
                <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-50 border border-red-100">無料</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="px-5 py-3 text-gray-700 border border-gray-200">対応時間</td>
                <td className="px-5 py-3 text-center text-gray-500 border border-gray-200">平日昼のみ</td>
                <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-50 border border-red-100">24時間365日</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-5 py-3 text-gray-700 border border-gray-200">証拠集めアドバイス</td>
                <td className="px-5 py-3 text-center text-gray-500 border border-gray-200">○</td>
                <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-50 border border-red-100">○</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-5 py-3 text-gray-700 border border-gray-200 rounded-bl-xl">法的手続き代理</td>
                <td className="px-5 py-3 text-center text-gray-500 border border-gray-200">○</td>
                <td className="px-5 py-3 text-center text-gray-500 bg-red-50 border border-red-100 rounded-br-xl">✗（提携弁護士紹介）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">※ まずAIで状況整理・書類準備 → 深刻なケースは弁護士へ（法テラス: 0570-078374）</p>
      </section>

      {/* How To */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">使い方は3ステップ</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_TO.map((h) => (
            <div key={h.step} className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{h.step}</div>
              <div className="font-bold text-gray-900 mb-2">{h.title}</div>
              <div className="text-sm text-gray-600">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 生成サンプルプレビュー */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-block bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">実際の生成サンプル</div>
          <h2 className="text-2xl font-bold text-gray-900">こんな書類が30秒で届きます</h2>
          <p className="text-gray-500 text-sm mt-2">ケース: 上司から3ヶ月間怒鳴られ続けている会社員（録音あり）</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSampleTab(tab)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  sampleTab === tab
                    ? "border-red-600 text-red-600 bg-red-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {SAMPLE_PREVIEW[sampleTab].split('\n').map((line, i) => {
                if (line.startsWith('【') && line.endsWith('】')) {
                  return (
                    <h3 key={i} className="text-sm font-black pt-2 pb-1 border-b border-red-200 text-red-700">
                      {line}
                    </h3>
                  );
                }
                if (line.startsWith('■')) {
                  return (
                    <p key={i} className="text-sm font-bold text-gray-800 mt-3">{line}</p>
                  );
                }
                if (line.startsWith('━')) {
                  return (
                    <p key={i} className="text-xs font-bold text-red-600 mt-3 border-t border-red-100 pt-2">{line}</p>
                  );
                }
                if (line.match(/^[①②③④⑤]/) || line.match(/^[\d]+\./) || line.match(/^[・□✅]\s/)) {
                  return (
                    <div key={i} className="flex gap-2 items-start text-sm text-gray-700">
                      <span className="flex-shrink-0 mt-0.5 text-red-500">●</span>
                      <span>{line.replace(/^[・□✅]\s*/, '')}</span>
                    </div>
                  );
                }
                if (line.trim() === '') return <div key={i} className="h-1" />;
                return (
                  <p key={i} className="text-sm leading-relaxed text-gray-700">{line}</p>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 text-center">
            <p className="text-xs text-gray-400 mb-3">※ 実際の生成結果はあなたの状況・証拠・加害者の役職に基づいてAIが個別に作成します</p>
            <button
              onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block bg-red-600 text-white font-bold px-7 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              🛡️ 自分の対策書類を今すぐ作成する（無料3回）→
            </button>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section id="tool" className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">無料で診断する</h2>
          <p className="text-center text-gray-500 text-sm mb-8">無料3回まで / プレミアムプランで無制限</p>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
            {/* プリセット */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">よくある問題（タップで追加）</label>
              <div className="flex flex-wrap gap-2">
                {PROBLEM_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePreset(p)}
                    className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 状況（必須・1フィールドで即生成可能） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状況を1行で教えてください <span className="text-red-500">*</span>
              </label>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="例：上司から毎日怒鳴られ、業務外の作業を強要されています"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <p className="text-xs text-gray-400 mt-1">これだけで診断できます。より詳しい情報は下の「詳細情報」から任意で追加できます。</p>
            </div>

            {/* 詳細情報（折りたたみ・任意） */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
              >
                <span>{showDetails ? "▼" : "▶"}</span>
                {showDetails ? "詳細情報を非表示" : "より正確な診断のために詳細を入力（任意）"}
              </button>

              {showDetails && (
                <div className="mt-4 space-y-5 border border-red-100 rounded-xl p-5 bg-red-50/30">
                  <p className="text-xs text-gray-500">以下の情報を追加すると、より精度の高い書類が生成されます。</p>

                  {/* 期間 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">期間・頻度（任意）</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="例: 約3ヶ月間、ほぼ毎日"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  {/* 加害者の役職 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">加害者の役職（任意）</label>
                    <div className="flex flex-wrap gap-2">
                      {POSITION_OPTIONS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPosition(p)}
                          className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                            position === p
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 証拠 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">証拠・記録の状況（任意・複数選択可）</label>
                    <div className="flex flex-wrap gap-2">
                      {EVIDENCE_OPTIONS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => toggleEvidence(e)}
                          className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                            evidence.includes(e)
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 深刻度チェック */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      深刻度チェック（任意）
                      <span className="ml-2 text-xs text-gray-400">（あなた自身の感覚で選んでください）</span>
                    </label>
                    <div className="bg-white rounded-xl p-4 border border-red-100">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={severity}
                        onChange={(e) => setSeverity(Number(e.target.value))}
                        className="w-full accent-red-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1 px-0.5">
                        <span>1<br/>軽微</span>
                        <span className="text-center">2<br/>気になる</span>
                        <span className="text-center">3<br/>つらい</span>
                        <span className="text-center">4<br/>深刻</span>
                        <span className="text-right">5<br/>限界</span>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="inline-block bg-red-50 border border-red-300 text-red-700 font-bold text-sm px-4 py-1.5 rounded-full shadow-sm">
                          {severity === 1 && "レベル1 — まず状況を記録・整理しましょう"}
                          {severity === 2 && "レベル2 — 証拠収集を今すぐ始めましょう"}
                          {severity === 3 && "レベル3 — 内容証明の準備を検討してください"}
                          {severity === 4 && "レベル4 — 労基署への相談を強くお勧めします"}
                          {severity === 5 && "レベル5 — 今すぐ弁護士・法テラスに連絡してください"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</div>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {loading ? "🔄 生成中（30秒ほどかかります）..." : "🛡️ 診断開始（無料）"}
            </button>

            {!isPremium && (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">残り無料回数: {Math.max(0, FREE_LIMIT - usageCount)}回</p>
                <button onClick={() => startCheckout("standard")} className="text-sm text-red-600 underline hover:text-red-800">
                  プランを選んで無制限に使う（¥980/月〜）→
                </button>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">AIが状況を分析しています...</p>
                <p className="text-xs text-gray-400 mt-2">📊 状況分析 → ⚖️ 法的根拠確認 → 📋 対応スクリプト生成</p>
                <p className="text-xs text-gray-300 mt-1">通常30秒ほどかかります</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div ref={resultRef} className="mt-8 space-y-4 animate-fade-in-up">
            {/* パワハラ重大度スコアカード */}
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 mb-4">
              <p className="text-xs text-red-500 font-bold mb-1">AI パワハラ重大度分析</p>
              <div className="flex items-center gap-3">
                <div className="text-5xl font-black text-red-600 animate-stamp">
                  {/重大|深刻|違法/.test(result["法的評価"]) ? "9" : /中程度|可能性/.test(result["法的評価"]) ? "6" : "4"}
                </div>
                <div>
                  <div className="text-sm font-bold text-red-700">/ 10 パワハラ重大度</div>
                  <div className="text-xs text-red-500 mt-0.5">
                    {/重大|深刻|違法/.test(result["法的評価"]) ? "⚠️ 法的措置を強くお勧めします" :
                     /中程度|可能性/.test(result["法的評価"]) ? "📋 証拠収集を開始しましょう" :
                     "📝 継続的な記録が重要です"}
                  </div>
                </div>
              </div>
            </div>
            {!isPremium && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-red-800 text-sm mb-1">📄 内容証明文・労基署申告書を生成しますか？</p>
                  <p className="text-xs text-red-700">プランにアップグレードすると、書類を何度でも生成できます（¥980/月〜）</p>
                </div>
                <button
                  onClick={() => startCheckout("standard")}
                  className="shrink-0 bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 text-sm whitespace-nowrap"
                >
                  今すぐアップグレード →
                </button>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-red-600 text-red-600 bg-red-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <div className="flex justify-end gap-2 mb-4 flex-wrap">
                  <button
                    onClick={downloadResult}
                    className="text-sm text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors font-bold"
                    title="全5書類をテキストファイルで保存"
                  >
                    💾 全書類を保存
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `「パワハラ重大度${/重大|深刻|違法/.test(result["法的評価"]) ? "9" : /中程度|可能性/.test(result["法的評価"]) ? "6" : "4"}/10... これ職場に当てはまりすぎて怖い😅 対応策もAIが全部出してくれた → https://pawahara-ai.vercel.app #パワハラ対策 #労働問題 #AI相談`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white bg-sky-500 rounded-lg px-4 py-2 hover:bg-sky-600 transition-colors"
                  >
                    𝕏 シェア
                  </a>
                  <button
                    onClick={copyTab}
                    className="text-sm text-gray-500 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    📋 コピー
                  </button>
                </div>
                {result[activeTab]
                  ? <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(result[activeTab]) }} />
                  : <p className="text-sm text-gray-400">（このタブの内容がありません）</p>
                }
              </div>
              {/* 次のアクション3選 */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-bold text-red-800 mb-3">📋 次にやるべきこと3選</p>
                <ol className="space-y-2">
                  {[
                    { icon: "📝", text: "今日から日時・内容・証人を記録した「パワハラ日誌」をつける" },
                    { icon: "🏛️", text: "労働局・総合労働相談コーナーに無料相談を申し込む" },
                    { icon: "⚖️", text: "深刻なケースは弁護士の無料法律相談（法テラス）を利用する" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-lg leading-none">{item.icon}</span>
                      <span>{i + 1}. {item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {/* 弁護士相談アフィリエイト（A8.net申請後URLを差し替え） */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-sm font-black text-slate-800 mb-1">⚖️ 弁護士に無料相談する</p>
                <p className="text-xs text-slate-600 mb-4">深刻なパワハラは弁護士への相談が最短解決策。初回無料・秘密厳守の事務所が多数。</p>
                <div className="space-y-2">
                  <a href="https://www.bengo4.com/c_5/" target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between bg-white border border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-slate-800">弁護士ドットコム — 労働問題専門</div>
                      <div className="text-xs text-slate-500 mt-0.5">初回相談無料 • 全国の弁護士を即日検索</div>
                    </div>
                    <span className="text-red-600 font-bold text-xs bg-red-50 border border-red-200 px-2 py-1 rounded-full">無料相談 →</span>
                  </a>
                  <a href="https://www.legal-mall.com/s/roudou" target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between bg-white border border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-slate-800">ベンナビ労働問題 — パワハラ・解雇</div>
                      <div className="text-xs text-slate-500 mt-0.5">地域・得意分野で絞り込み • 弁護士費用の目安も確認</div>
                    </div>
                    <span className="text-red-600 font-bold text-xs bg-red-50 border border-red-200 px-2 py-1 rounded-full">弁護士を探す →</span>
                  </a>
                </div>
                <p className="text-xs text-slate-400 text-center mt-3">※ 広告・PR掲載（各社公式サイトに遷移します）</p>
              </div>
              {/* 労務・メンタルケアアフィリエイト */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="text-sm font-black text-green-800 mb-1">💼 労務・給与管理を整えよう</p>
                <p className="text-xs text-green-700 mb-3">パワハラ解決後は労務・給与の正しい管理も大切。クラウド会計で経費・給与を一括管理しましょう。</p>
                <a
                  href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+3LSINM+3SPO+9FDPYR"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-between bg-white border border-green-300 rounded-xl px-4 py-3 hover:bg-green-50 transition-colors mb-2"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800">freee会計 — 給与・経費をまとめて管理</div>
                    <div className="text-xs text-slate-500 mt-0.5">中小企業・フリーランス向け • 初月無料で試せる</div>
                  </div>
                  <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">無料で試す →</span>
                </a>
                <p className="text-xs text-slate-400 text-center mt-1 mb-3">※ 広告・PR掲載（公式サイトに遷移します）</p>
                <p className="text-sm font-black text-blue-800 mb-1">🧘 ストレス発散にオンラインヨガ</p>
                <p className="text-xs text-blue-700 mb-3">職場ストレスが続くときは、体を動かすことが心の回復に効果的。自宅でいつでも参加できるヨガで気持ちをリセット。</p>
                <a
                  href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-between bg-white border border-blue-300 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800">SOELU — オンラインヨガ・フィットネス</div>
                    <div className="text-xs text-slate-500 mt-0.5">自宅でライブレッスン参加 • 初回30日間無料</div>
                  </div>
                  <span className="text-blue-700 font-bold text-xs bg-blue-100 px-2 py-1 rounded-full">無料で始める →</span>
                </a>
                <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載（公式サイトに遷移します）</p>
                {/* FPカフェアフィリエイト（A8.net）*/}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-black text-blue-800 mb-1">💰 弁護士費用のご相談（PR）</p>
                  <p className="text-xs text-blue-700 mb-3">パワハラ・労働問題の弁護士費用や法的費用について、FPに無料相談できます。</p>
                  <a
                    href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+2SMA0I+5ULO+5YZ75"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between bg-white border border-blue-300 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800">FPカフェ — お金の専門家に無料相談</div>
                      <div className="text-xs text-slate-500 mt-0.5">弁護士費用・資金繰りを専門家がサポート • 全国対応</div>
                    </div>
                    <span className="text-blue-700 font-bold text-xs bg-blue-100 px-2 py-1 rounded-full">無料相談 →</span>
                  </a>
                  <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載（公式サイトに遷移します）</p>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* 証拠保全チェックリスト */}
          <PawaharaChecklist />
          {/* 証拠記録タイムライン */}
          <EvidenceTimeline />
        </div>
      </section>

      {/* Voices */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">利用者の声</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {VOICES.map((v) => (
            <div key={v.role} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-sm text-gray-700 mb-4">「{v.text}」</p>
              <p className="text-xs text-gray-400">{v.role}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
      </section>

      {/* Pricing */}
      <section className="bg-red-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">料金プラン</h2>
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6">
            <p className="text-sm text-amber-700 font-bold mb-3 text-center">💰 弁護士費用シミュレーター — あなたが節約できる金額</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { item: "初回相談料", lawyer: "¥5,000〜10,000", ai: "無料", saving: "最大¥10,000節約" },
                { item: "内容証明作成", lawyer: "¥30,000〜50,000", ai: "無料〜¥980/月", saving: "最大¥50,000節約" },
                { item: "労基署申告書", lawyer: "¥20,000〜", ai: "無料〜¥2,980/月", saving: "最大¥20,000節約" },
                { item: "着手金（訴訟）", lawyer: "¥300,000〜", ai: "書類準備のみ", saving: "準備コスト削減" },
              ].map((row) => (
                <div key={row.item} className="bg-white border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-gray-700 mb-1">{row.item}</p>
                  <p className="text-xs text-gray-400 line-through mb-0.5">{row.lawyer}</p>
                  <p className="text-sm font-black text-amber-600">{row.ai}</p>
                  <p className="text-xs text-green-600 font-bold mt-1">{row.saving}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 text-center">
              <p className="text-amber-800 font-black text-lg">最大 ¥300,000 以上の節約</p>
              <p className="text-xs text-amber-700 mt-0.5">弁護士に依頼する前にAIで準備 → 弁護士費用を大幅に圧縮できます</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-lg font-bold text-gray-900 mb-2">無料プラン</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">¥0</div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li>✅ 3回まで無料で利用可能</li>
                <li>✅ 全5タブの書類生成</li>
                <li>✅ コピー機能</li>
              </ul>
              <button
                onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full border border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                無料で試す
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-300">
              <div className="text-lg font-bold text-gray-900 mb-2">ライトプラン</div>
              <div className="text-3xl font-bold text-red-600 mb-4">¥980<span className="text-lg font-normal text-gray-500">/月</span></div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li>✅ 法的評価（パワハラ該当判定）</li>
                <li>✅ 証拠収集ガイドライン</li>
                <li>✅ 月3回まで</li>
                <li className="text-gray-400 text-xs">— 内容証明・申告書はなし</li>
              </ul>
              <button
                onClick={() => startCheckout("light")}
                className="w-full border border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                ライトプランで始める
              </button>
            </div>
            <div className="bg-red-600 rounded-2xl p-6 text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">おすすめ</div>
              <div className="text-lg font-bold mb-2">スタンダードプラン</div>
              <div className="text-3xl font-bold mb-4">¥2,980<span className="text-lg font-normal">/月</span></div>
              <ul className="text-sm space-y-2 mb-6 text-left">
                <li>✅ 全機能利用可能</li>
                <li>✅ 内容証明・申告書ドラフト</li>
                <li>✅ 選択肢マップ</li>
                <li>✅ 無制限利用</li>
                <li>✅ いつでも解約可能</li>
              </ul>
              <button
                onClick={() => startCheckout("standard")}
                className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                スタンダードにアップグレード
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">※ 弁護士費用の相場: 着手金30〜100万円 / 本サービスは法的助言ではありません</p>
        </div>
      </section>

      {/* Cross-sell: クレームAI */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex items-center gap-5">
          <div className="text-4xl shrink-0">⚡</div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-orange-500 mb-1">一緒に使うと効果的</p>
            <h3 className="font-bold text-gray-900 mb-1">クレームAI との併用で外部クレームにも即対応</h3>
            <p className="text-sm text-gray-600">社内ハラスメント対策 + 顧客・取引先からのカスタマーハラスメント対応をワンセットで。中小企業のCS・HR担当者に最適。</p>
          </div>
          <a
            href="https://claim-ai-beryl.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            詳細を見る →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "どんなパワハラ事例に対応していますか？", a: "怒鳴り・無視・過大な業務・個人攻撃・SNS投稿など厚生労働省が定める6類型すべてに対応。証拠記録・社内相談・法的手続きまでサポートします。" },
              { q: "弁護士に相談するより何が良いですか？", a: "弁護士着手金の相場は¥30〜50万。本サービスは月額¥9,800で24時間いつでも対応策を生成できます。まず状況整理→必要なら弁護士紹介まで一貫してサポートします。" },
              { q: "証拠が残っていなくても使えますか？", a: "はい。証拠がない状態でも、今後の証拠収集方法・記録のつけ方・証人確保の手順をAIがアドバイスします。これから証拠を作るためのツールとしても活用できます。" },
              { q: "会社に知られずに使えますか？", a: "完全に匿名でご利用いただけます。入力した情報は会社・上司・人事部門には一切共有されません。" },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-semibold text-orange-700 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SNS Share */}
      <section className="py-8 px-6 text-center border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-4">パワハラで困っている知人に教えてあげてください</p>
        <div className="inline-flex flex-col sm:flex-row gap-2">
          <a
            href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("パワハラ対策AI — 状況を入力するだけで内容証明・申告書・退職交渉文を15秒で作成📄 無料で試せます → https://pawahara-ai.vercel.app #パワハラ #パワハラ対策 #労働問題")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xでシェアする
          </a>
          <a
            href={"https://line.me/R/msg/text/?" + encodeURIComponent("パワハラ対策AI📄 状況を入力するだけで内容証明・申告書を15秒で作成！無料で試せます → https://pawahara-ai.vercel.app")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
            style={{ background: "#06C755" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINEで送る
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© 2026 パワハラ対策AI</span>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-gray-600">特定商取引法</Link>
            <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-gray-100 pt-3 mt-4 text-xs text-center text-gray-400">
          <p className="mb-1">ポッコリラボの他のサービス</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="https://claim-ai-beryl.vercel.app" className="hover:text-gray-600">クレームAI</a>
            <a href="https://hojyokin-ai-delta.vercel.app" className="hover:text-gray-600">補助金AI</a>
            <a href="https://keiyakusho-ai.vercel.app" className="hover:text-gray-600">契約書AIレビュー</a>
            <a href="https://rougo-sim-ai.vercel.app" className="hover:text-gray-600">老後シミュレーターAI</a>
            <a href="https://ai-keiei-keikaku.vercel.app" className="hover:text-gray-600">AI経営計画書</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

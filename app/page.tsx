"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

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
];

const POSITION_OPTIONS = ["経営者・オーナー", "役員・取締役", "部長・マネージャー", "課長・チームリーダー", "先輩・同僚", "その他"];

const EVIDENCE_OPTIONS = ["録音・録画がある", "メール・LINEのやり取りがある", "日記・メモをつけている", "目撃者がいる", "診断書がある", "何も記録していない"];

const FEATURES = [
  { icon: "⚖️", title: "法的評価", desc: "あなたの状況がパワハラ・労働法違反に該当するか法的に判定。どの法律が適用されるかも明示。" },
  { icon: "📋", title: "証拠収集ガイド", desc: "今日からできる証拠の集め方をチェックリスト形式で提供。録音・記録の注意点も解説。" },
  { icon: "✉️", title: "内容証明文の自動生成", desc: "会社・上司への内容証明書をAIが全文作成。そのままコピーして郵送できます。" },
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
function incrementUsage(): number {
  const n = getUsageCount() + 1;
  localStorage.setItem("pawahara_usage", String(n));
  return n;
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
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => setIsPremium(d.isPremium))
      .catch(() => {});
  }, []);

  const toggleEvidence = (e: string) => {
    setEvidence((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
  };

  const handlePreset = (p: string) => {
    setSituation((prev) => prev ? prev + "\n" + p : p);
  };

  const startCheckout = () => setShowPayjp(true);

  const handleGenerate = async () => {
    if (!situation.trim()) { setError("状況を入力してください"); return; }
    setError("");
    const count = getUsageCount();
    if (!isPremium && count >= FREE_LIMIT) {
      setError("無料の利用回数（3回）を超えました。プレミアムプランにアップグレードしてください。");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, duration, position, evidence }),
      });
      if (!res.ok) throw new Error("生成に失敗しました");
      const data = await res.json();
      const parsed = parseResult(data.text);
      setResult(parsed);
      setActiveTab("法的評価");
      const newCount = incrementUsage();
      setUsageCount(newCount);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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

  return (
    <main className="min-h-screen bg-white">
      {showPayjp && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="プレミアムプラン ¥1,980/月 — 生成回数無制限"
          onSuccess={() => { setShowPayjp(false); setIsPremium(true); }}
          onClose={() => setShowPayjp(false)}
        />
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block bg-red-50 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🛡️ パワハラ対策AI — 弁護士費用ゼロで自分を守る
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          状況を入力するだけ。<br />
          <span className="text-red-600">法的評価・証拠収集・内容証明・申告書</span><br />
          をAIが即生成
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          パワハラ・残業未払い・不当解雇に悩んでいませんか？<br />
          弁護士に頼むと着手金だけで<strong>30〜100万円</strong>。<br />
          AIなら<strong>月¥1,980</strong>で対策書類を無制限に作成できます。
        </p>
        <p className="text-sm text-gray-400 mb-8">※ 本サービスは法的助言ではありません。参考情報としてご活用ください。</p>
        <button
          onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-red-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
        >
          無料3回 — 今すぐ診断する
        </button>
        <div className="flex justify-center gap-8 mt-10 text-sm text-gray-500">
          <span>✅ 登録不要</span>
          <span>✅ 無料3回</span>
          <span>✅ 30秒で生成</span>
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

            {/* 状況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状況の詳細 *</label>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="例: 上司から毎日怒鳴られ、「お前は使えない」「クビにするぞ」と言われ続けています。他の社員の前で怒鳴られることもあります。3ヶ月前から続いており、睡眠が取れない状態です。"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* 期間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">期間・頻度</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-3">加害者の役職</label>
              <div className="flex flex-wrap gap-2">
                {POSITION_OPTIONS.map((p) => (
                  <button
                    key={p}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">証拠・記録の状況（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {EVIDENCE_OPTIONS.map((e) => (
                  <button
                    key={e}
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

            {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</div>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {loading ? "🔄 生成中（30秒ほどかかります）..." : "🛡️ 対策書類を生成する（無料）"}
            </button>

            {!isPremium && (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">残り無料回数: {Math.max(0, FREE_LIMIT - usageCount)}回</p>
                <button onClick={startCheckout} className="text-sm text-red-600 underline hover:text-red-800">
                  プレミアムプランで無制限に使う（¥1,980/月）→
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div ref={resultRef} className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
                <div className="flex justify-end mb-4">
                  <button
                    onClick={copyTab}
                    className="text-sm text-gray-500 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    📋 コピー
                  </button>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result[activeTab] || "（このタブの内容がありません）"}
                </div>
              </div>
            </div>
          )}
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
      </section>

      {/* Pricing */}
      <section className="bg-red-50 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">料金プラン</h2>
          <div className="grid md:grid-cols-2 gap-6">
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
            <div className="bg-red-600 rounded-2xl p-6 text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">おすすめ</div>
              <div className="text-lg font-bold mb-2">プレミアムプラン</div>
              <div className="text-3xl font-bold mb-4">¥1,980<span className="text-lg font-normal">/月</span></div>
              <ul className="text-sm space-y-2 mb-6 text-left">
                <li>✅ 生成回数 無制限</li>
                <li>✅ 全5タブの書類生成</li>
                <li>✅ コピー機能</li>
                <li>✅ いつでも解約可能</li>
              </ul>
              <button
                onClick={startCheckout}
                className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                プレミアムにアップグレード
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">※ 弁護士費用の相場: 着手金30〜100万円 / 本サービスは法的助言ではありません</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© 2025 パワハラ対策AI</span>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-gray-600">特定商取引法</Link>
            <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

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
      setShowPaywall(true);
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
      // APIが429を返した場合はペイウォール表示（シークレット窓対策）
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "LIMIT_REACHED") {
          setShowPaywall(true);
        } else {
          setError("リクエストが多すぎます。しばらく待ってから再試行してください。");
        }
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("生成に失敗しました");
      const data = await res.json();
      const parsed = parseResult(data.text);
      setResult(parsed);
      setActiveTab("法的評価");
      // サーバー側cookieカウントをlocalStorageに同期（正の値として扱う）
      if (typeof data.count === "number") {
        syncUsageCount(data.count);
        setUsageCount(data.count);
      }
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
          planLabel={payjpPlan === "light" ? "ライトプラン ¥980/月" : "スタンダードプラン ¥2,980/月"}
          plan={payjpPlan}
          onSuccess={() => { setShowPayjp(false); setShowPaywall(false); setIsPremium(true); }}
          onClose={() => setShowPayjp(false)}
        />
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
                  onClick={() => { setPayjpPlan("light"); setShowPaywall(false); setShowPayjp(true); }}
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
                  onClick={() => { setPayjpPlan("standard"); setShowPaywall(false); setShowPayjp(true); }}
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
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block bg-red-50 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🛡️ パワハラ対策AI — 対策書類を15秒で作成
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
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{SAMPLE_PREVIEW[sampleTab]}</pre>
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
                <button onClick={() => startCheckout("standard")} className="text-sm text-red-600 underline hover:text-red-800">
                  プランを選んで無制限に使う（¥980/月〜）→
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div ref={resultRef} className="mt-8 space-y-4">
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
                <div className="flex justify-end gap-2 mb-4">
                  {activeTab === "法的評価" && result?.["法的評価"] && (
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        "AIがパワハラ診断をしました 🛡️\n\n" +
                        result["法的評価"].slice(0, 100) + "...\n\n" +
                        "同じ状況で悩んでいる人に届けたい👇\n" +
                        "#パワハラ対策AI #ブラック企業対策 #労働問題"
                      )}&url=${encodeURIComponent("https://pawahara-ai.vercel.app")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white bg-black rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      𝕏 シェア
                    </a>
                  )}
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
        <p className="text-xs text-gray-400 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
      </section>

      {/* Pricing */}
      <section className="bg-red-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">料金プラン</h2>
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

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© 2026 パワハラ対策AI</span>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-gray-600">特定商取引法</Link>
            <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

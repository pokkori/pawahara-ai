import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "クレーム対応AI｜法人・チェーン店向けプラン｜スタッフ全員の対応品質を統一",
  description: "複数店舗・チームで使えるクレーム対応AIツール。スタッフ全員が即座にプロ品質の対応文を生成。メール文・電話スクリプト・チェックリストをセット出力。飲食チェーン・EC・ホテル向け。",
};

const PROBLEMS = [
  { title: "ベテランが辞めたらクレーム対応の質が落ちた", desc: "属人化したスキルをAIで標準化。誰でも即戦力に。" },
  { title: "新人スタッフが感情的な返信をして炎上した", desc: "AIが生成した文章をコピペするだけ。感情に左右されない。" },
  { title: "本部に報告・相談するたびに時間がかかる", desc: "現場が即対応できる。本部への報告は事後でOK。" },
  { title: "月に何件もクレームがありその都度時間を取られる", desc: "1件あたり5〜10分 → 30秒。月の対応工数を90%削減。" },
];

const USECASES = [
  {
    icon: "🍽",
    title: "飲食チェーン店",
    problem: "異物混入・食中毒の疑い・接客クレームが頻発。SNS拡散リスクが高い。",
    solution: "深刻度「重大」設定で法的リスクを考慮した対応文を即生成。初動30分の対応を標準化。",
    result: "クレーム対応時間を平均1時間 → 5分に短縮",
  },
  {
    icon: "📦",
    title: "EC・通販企業",
    problem: "配送トラブル・返品返金クレームのメール対応に毎日2〜3時間。CSスタッフの離職も。",
    solution: "注文番号・商品名を入れるだけで完全なメール文が生成。コピペして送信するだけ。",
    result: "CS一人あたりの対応件数が2.5倍に向上",
  },
  {
    icon: "🏨",
    title: "ホテル・旅館",
    problem: "OTAレビューへの悪影響が予約数に直結。深夜のクレームでも即対応が必要。",
    solution: "電話スクリプトで深夜フロントでも迷わず対応。翌日のメールフォローも自動生成。",
    result: "OTA評価が平均3.8 → 4.2に改善",
  },
];

const PLANS = [
  {
    name: "スタンダード",
    price: "¥4,980",
    per: "/月",
    target: "小規模店舗・個人事業主",
    features: ["月100件まで生成", "全業種対応", "メール・電話・チェックリスト", "履歴保存"],
    cta: "申し込む",
    highlight: false,
  },
  {
    name: "ビジネス",
    price: "¥9,800",
    per: "/月",
    target: "複数スタッフ・チェーン店向け",
    features: ["無制限生成", "チームアカウント（5名）", "全機能＋優先サポート", "使い方レクチャー付き", "請求書払い対応"],
    cta: "申し込む",
    highlight: true,
  },
  {
    name: "エンタープライズ",
    price: "要相談",
    per: "",
    target: "10店舗以上・フランチャイズ本部",
    features: ["アカウント数無制限", "カスタムプロンプト設定", "社内マニュアル連携", "専任サポート担当"],
    cta: "お問い合わせ",
    highlight: false,
  },
];

export default function BusinessLP() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">AIクレーム対応文 <span className="text-blue-600 text-sm font-medium ml-2">法人向け</span></span>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">個人向けはこちら</Link>
            <Link href="/tool" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">無料で試す</Link>
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          飲食チェーン・EC企業・ホテル向け法人プラン
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          スタッフ全員の<br />クレーム対応品質を<span className="text-blue-600">統一する</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          ベテランも新人も同じ品質で対応できる。<br />AIがメール文・電話スクリプト・チェックリストをセットで30秒生成。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">
            無料で3回試す →
          </Link>
          <a href="mailto:contact@example.com" className="inline-block bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200">
            法人見積もりを依頼
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">クレジットカード不要・登録不要で試せます</p>
      </section>

      {/* ROI */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            {[
              { num: "90%", label: "クレーム対応工数の削減", sub: "1時間 → 5分" },
              { num: "¥12万", label: "月の人件費削減効果", sub: "CS担当者1名分に相当" },
              { num: "2.5倍", label: "CSスタッフの対応件数向上", sub: "同じ人数でより多く対応" },
            ].map(stat => (
              <div key={stat.num}>
                <div className="text-4xl font-bold mb-1">{stat.num}</div>
                <div className="text-sm font-medium text-blue-100">{stat.label}</div>
                <div className="text-xs text-blue-200 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">こんな課題を解決します</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROBLEMS.map(p => (
              <div key={p.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-red-500 shrink-0 mt-0.5">✗</span>{p.title}
                </p>
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <span className="text-green-500 shrink-0 mt-0.5">→</span>{p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 業種別ユースケース */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">業種別の導入効果</h2>
          <div className="space-y-5">
            {USECASES.map(u => (
              <div key={u.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{u.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{u.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">課題</p>
                    <p className="text-sm text-gray-600">{u.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-500 mb-1">解決策</p>
                    <p className="text-sm text-gray-600">{u.solution}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-600 mb-1">導入効果</p>
                    <p className="text-sm font-bold text-green-700">{u.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">法人向け料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">すべてのプランでメール文・電話スクリプト・チェックリストがフルセット</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${plan.highlight ? "border-blue-500 shadow-xl shadow-blue-50" : "border-gray-200"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full whitespace-nowrap">法人に一番人気</div>
                )}
                <p className="text-xs text-gray-400 mb-1">{plan.target}</p>
                <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-blue-600 mb-5">
                  {plan.price}<span className="text-sm font-normal text-gray-500">{plan.per}</span>
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.cta === "お問い合わせ" ? "mailto:contact@example.com" : "/tool"}
                  className={`block w-full text-center text-sm font-bold py-3 rounded-xl ${plan.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">よくある質問（法人向け）</h2>
          <div className="space-y-4">
            {[
              { q: "複数スタッフで同時に使えますか？", a: "ビジネスプランは5名まで同時利用できます。エンタープライズプランはアカウント数無制限です。それぞれのスタッフが独自の履歴・設定を持てます。" },
              { q: "自社のクレーム対応マニュアルを学習させられますか？", a: "エンタープライズプランでカスタムプロンプト設定が可能です。自社のトンマナ・補償基準・禁止用語などを反映した対応文を生成できます。" },
              { q: "請求書払い・銀行振込は対応していますか？", a: "ビジネスプラン以上で請求書払いに対応しています。月次・四半期・年次払いが選べます。" },
              { q: "トライアル期間はありますか？", a: "登録不要で3回無料でお試しいただけます。ビジネスプランに申し込み後14日以内であれば全額返金対応しています。" },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center px-6">
        <h2 className="text-2xl font-bold text-white mb-3">まずは無料で3回試してください</h2>
        <p className="text-blue-100 text-sm mb-8">登録不要・クレジットカード不要。実際の品質をご確認ください。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tool" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg">
            無料で試す →
          </Link>
          <a href="mailto:contact@example.com" className="inline-block bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-400">
            法人見積もりを依頼
          </a>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400 space-x-4">
        <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}

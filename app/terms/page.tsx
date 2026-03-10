import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 text-sm hover:opacity-80 mb-8 block">← トップに戻る</Link>
        <h1 className="text-2xl font-bold mb-2">利用規約</h1>
        <p className="text-blue-600 text-sm mb-8">Terms of Service</p>
        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第1条（適用）</h2>
            <p>本利用規約（以下「本規約」）は、levonadesign（以下「当社」）が提供するパワハラ対策AIサービス（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意の上、本サービスをご利用ください。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第2条（サービス内容）</h2>
            <p>本サービスは、AIを活用したハラスメント対応支援サービスです。AIの回答はあくまで参考情報であり、正確性・完全性・法的適切性を保証するものではありません。実際のハラスメント対応は専門家（弁護士・社労士等）にご相談ください。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第3条（料金・決済）</h2>
            <p>本サービスの利用料金はプレミアムプラン ¥1,980/月（税込）です。決済はPAY.JP（PAY.JP株式会社）を通じて処理されます。お申込み時に即時決済され、以降は毎月同日に自動更新されます。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第4条（解約・返金）</h2>
            <p>デジタルコンテンツの性質上、決済完了後の返金は承っておりません。解約はいつでもマイページより行えます。解約後は次回更新日まで引き続きご利用いただけます。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第5条（禁止事項）</h2>
            <p>以下の行為を禁止します：法令違反、他者への迷惑行為、サービスの逆コンパイル・改ざん、不正アクセス、商業目的での無断転載。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第6条（免責事項）</h2>
            <p>本サービスの利用によって生じた損害について、運営者は一切の責任を負いません。AIの分析結果を参考にした行動の結果についても同様です。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第7条（サービスの変更・停止）</h2>
            <p>運営者は予告なく本サービスの内容を変更・停止することがあります。</p>
          </section>
          <section>
            <h2 className="text-gray-900 font-bold mb-2">第8条（準拠法）</h2>
            <p>本規約は日本法に準拠し、東京地方裁判所を専属的合意管轄裁判所とします。</p>
          </section>
        </div>
        <p className="text-xs opacity-40 mt-12">制定日：2026年1月1日</p>
      </div>
    </main>
  );
}

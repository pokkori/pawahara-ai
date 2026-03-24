import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "パワハラの証拠収集完全ガイド｜録音・記録・メール保存の具体的な方法",
  description: "パワハラ被害を証明するための証拠収集方法を解説。録音、日時記録、メール・LINEの保存、医師の診断書取得まで具体的な手順を紹介します。",
};

export default function BlogPost() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
      <Link href="/blog" aria-label="コラム一覧に戻る" className="text-xs underline mb-8 inline-block" style={{ color: "#64748b" }}>
        コラム一覧へ
      </Link>
      <h1 className="text-2xl font-black mb-4 mt-4" style={{ color: "#e2e8f0" }}>
        パワハラの証拠収集完全ガイド
      </h1>
      <p className="mb-8" style={{ color: "#94a3b8" }}>2025年12月01日 · 5分で読める</p>

      <p className="mb-6">
        パワハラ被害を受けていても、「証拠がなければ認められない」と泣き寝入りするケースが多く見られます。
        しかし、適切な方法で証拠を集めれば、労働局への申告や損害賠償請求に十分な材料を揃えることができます。
      </p>

      <h2 className="text-lg font-black mt-8 mb-3" style={{ color: "#e2e8f0" }}>1. 音声・動画の録音</h2>
      <p className="mb-4">
        スマートフォンのボイスレコーダーアプリを使い、暴言・脅迫・叱責の場面を録音します。
        日本では会話の一方当事者が録音することは原則として違法ではありません。
        ポケットに入れておくだけで取れる場合がほとんどです。
      </p>

      <h2 className="text-lg font-black mt-8 mb-3" style={{ color: "#e2e8f0" }}>2. 日時・内容の記録</h2>
      <p className="mb-4">
        被害を受けた日時・場所・発言内容・目撃者をその日のうちにメモしてください。
        手書きのノートよりもスマートフォンのメモアプリの方が、タイムスタンプが自動付与されるため証拠力が高まります。
      </p>

      <h2 className="text-lg font-black mt-8 mb-3" style={{ color: "#e2e8f0" }}>3. メール・LINEのスクリーンショット</h2>
      <p className="mb-4">
        業務時間外の連絡、侮辱的な文言を含むメッセージは必ずスクリーンショットを撮り、クラウドに保存してください。
        削除や改ざんを防ぐため、受信後すぐに保存することが重要です。
      </p>

      <h2 className="text-lg font-black mt-8 mb-3" style={{ color: "#e2e8f0" }}>4. 医師の診断書</h2>
      <p className="mb-4">
        精神的・肉体的な症状がある場合は、早めに心療内科や内科を受診し診断書を取得してください。
        「業務上の出来事がストレス要因」と記載してもらうことで、労災認定の際に有効な証拠になります。
      </p>

      <h2 className="text-lg font-black mt-8 mb-3" style={{ color: "#e2e8f0" }}>まとめ</h2>
      <p className="mb-8">
        証拠が揃ったら、社内相談窓口・労働局・弁護士への相談を検討してください。
        まずはパワハラ対策AIで状況を整理し、どの対処法が適切か確認してみましょう。
      </p>

      <Link
        href="/"
        aria-label="パワハラ対策AIで今すぐ証拠書類を作成する"
        className="block text-center py-4 rounded-2xl font-black text-base"
        style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff" }}
      >
        パワハラ対策AIで証拠書類を作成する
      </Link>
    </main>
  );
}

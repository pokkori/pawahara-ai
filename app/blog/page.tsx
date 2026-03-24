import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "パワハラ対策コラム｜証拠収集・相談先・法的対処法",
  description: "パワハラ被害の証拠収集方法、相談先、法的対処法について専門的な情報をお届けします。",
};

const posts = [
  {
    slug: "pawahara-shoko-hoho",
    title: "パワハラの証拠収集完全ガイド｜録音・記録・メール保存の具体的な方法",
    description: "パワハラ被害を証明するための証拠収集方法を解説。録音、日時記録、メール・LINEの保存、医師の診断書取得まで具体的な手順を紹介します。",
    date: "2025-12-01",
    readTime: "5分",
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-2" style={{ color: "#e2e8f0" }}>
        パワハラ対策コラム
      </h1>
      <p className="text-sm mb-12" style={{ color: "#94a3b8" }}>
        証拠収集・相談先・法的対処法について解説
      </p>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            aria-label={`記事を読む: ${post.title}`}
            className="block rounded-2xl p-6 transition-all hover:scale-[1.01]"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <p className="text-xs mb-2" style={{ color: "#64748b" }}>
              {post.date} · {post.readTime}で読める
            </p>
            <h2 className="text-lg font-black mb-2" style={{ color: "#e2e8f0" }}>
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

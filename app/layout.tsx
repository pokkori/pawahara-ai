import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const SITE_URL = "https://pawahara-ai.vercel.app";
const TITLE = "パワハラ対策AI｜状況を入力するだけで証拠収集・内容証明・申告書を即生成";
const DESC = "パワハラ・残業未払い・不当解雇の状況を入力するだけ。法的評価・証拠収集チェックリスト・内容証明文・労基署申告書を自動生成。弁護士費用ゼロで自分を守る。無料3回から。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "パワハラ対策AI",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "パワハラ対策AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    site: "@levona_design",
    images: ["/og.png"],
  },
  metadataBase: new URL(SITE_URL),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "パワハラ対策AI",
      "description": DESC,
      "inLanguage": "ja",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#service`,
      "name": "パワハラ対策AI",
      "url": SITE_URL,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": DESC,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
        "description": "無料プラン3回まで利用可能"
      },
      "featureList": [
        "パワハラ法的評価（パワハラ防止法・民法709条）",
        "証拠収集ガイドライン自動生成",
        "内容証明文ドラフト自動生成",
        "労働基準監督署申告書ドラフト",
        "選択肢マップ（費用・手順・期間）",
        "証拠記録タイムライン",
        "証拠保全チェックリスト"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "どんなパワハラ事例に対応していますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "怒鳴り・無視・過大な業務・個人攻撃・SNS投稿など厚生労働省が定める6類型すべてに対応。証拠記録・社内相談・法的手続きまでサポートします。"
          }
        },
        {
          "@type": "Question",
          "name": "弁護士に相談するより何が良いですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "弁護士着手金の相場は30〜50万円。本サービスは月額980円から24時間いつでも対応策を生成できます。まず状況整理→必要なら弁護士紹介まで一貫してサポートします。"
          }
        },
        {
          "@type": "Question",
          "name": "証拠が残っていなくても使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい。証拠がない状態でも、今後の証拠収集方法・記録のつけ方・証人確保の手順をAIがアドバイスします。これから証拠を作るためのツールとしても活用できます。"
          }
        },
        {
          "@type": "Question",
          "name": "会社に知られずに使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "完全に匿名でご利用いただけます。入力した情報は会社・上司・人事部門には一切共有されません。"
          }
        },
        {
          "@type": "Question",
          "name": "内容証明文は実際に送れますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AIが生成する内容証明文はドラフト（参考文）です。実際に送付する前に内容を確認し、必要に応じて弁護士にレビューを依頼することをお勧めします。本サービスは法的助言ではありません。"
          }
        },
        {
          "@type": "Question",
          "name": "パワハラ防止法（労働施策総合推進法）とは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "労働施策総合推進法第30条の2に定める法律で、優越的な関係を背景に業務上必要な範囲を超えた言動により就業環境を害することをパワーハラスメントと定義しています。違反した場合、民法709条（不法行為）に基づく損害賠償請求が可能です。"
          }
        }
      ]
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Analytics />
        {/* Microsoft Clarity — pokkoriがhttps://clarity.microsoft.com/でプロジェクト登録後にIDを設定 */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "CLARITY_PROJECT_ID_HERE");
          `}
        </Script>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import FeedbackButton from "@/components/FeedbackButton";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PHProvider } from "./providers";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});


const SITE_URL = "https://pawahara-ai.vercel.app";
const TITLE = "パワハラ対策AI｜状況を入力するだけで証拠収集・内容証明・申告書を即生成";
const DESC = "上司のパワハラ、弁護士費用の1/100でAIが対処法を即提示。証拠収集から対話スクリプトまで。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "パワハラ対策AI",
    locale: "ja_JP",
    type: "website",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "パワハラ対策AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    site: "@levona_design",
    images: [`${SITE_URL}/og.png`],
  },
  metadataBase: new URL(SITE_URL),
  other: { "theme-color": "#0B0F1E" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "パワハラ対策AIツール", "item": `${SITE_URL}/tool` },
  ],
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
        },
        {
          "@type": "Question",
          "name": "パワハラを労働基準監督署に申告するにはどうすればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "パワハラAIが生成する「労働基準監督署申告書ドラフト」を使えば、証拠・経緯・請求内容を整理した申告書の雛形が即生成されます。申告の際は労働局・労基署（無料）に相談が可能です。法テラス（0570-078374）では弁護士費用の立替制度もあります。証拠録音・日記・診断書があると申告の信頼性が高まります。"
          }
        },
        {
          "@type": "Question",
          "name": "パワハラで精神科に通院しています。損害賠償は請求できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "精神的苦痛に対する慰謝料（民法709条・710条）と、休業による損害（逸失利益）を損害賠償として請求できる可能性があります。診断書は最重要証拠となります。パワハラAIは法的評価・損害賠償の可能性判定・証拠収集ガイドラインを生成し、弁護士相談の準備資料として使えます。"
          }
        },
        {
          "@type": "Question",
          "name": "残業代が支払われていない場合の請求方法は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "未払い残業代は労働基準法第37条に基づき請求できます。時効は2年間（一部3年）です。証拠として、タイムカード・勤怠システムのスクリーンショット・PCのログイン記録・メールのタイムスタンプが有効です。パワハラAIは「残業代請求の内容証明文ドラフト」と「労基署申告書ドラフト」を即生成します。"
          }
        },
        {
          "@type": "Question",
          "name": "パワハラを受けた後、退職すべきですか？在職すべきですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "在職中の方が証拠収集・交渉・申告が有利です。ただし、心身への影響が深刻な場合は休職（労働基準法・就業規則に基づく）を優先することを推奨します。パワハラAIの「選択肢マップ」では、在職・休職・退職・法的手続きそれぞれの費用・手順・期間を比較して提示します。"
          }
        },
        {
          "@type": "Question",
          "name": "パワハラ防止法の義務化範囲はどこまでですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "労働施策総合推進法（いわゆるパワハラ防止法）は2022年4月から中小企業にも義務化されました。現在はすべての企業規模・業種で(1)ハラスメント防止方針の策定・周知、(2)相談窓口の設置、(3)再発防止措置が義務です。違反した場合、厚生労働省による指導・勧告・企業名公表の対象となります。"
          }
        },
        {
          "@type": "Question",
          "name": "社内調査委員会の設置方法を教えてください",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "社内調査委員会は、被害者・加害者・証人から独立した第三者（社外弁護士・産業カウンセラー等）を含む3名以上で構成することが推奨されます。パワハラAIは「社内調査委員会設置チェックリスト」と「ヒアリング質問例」を生成し、調査の公正性確保を支援します。人事部門が加害者側に近い場合は外部機関（労働局の紛争調整委員会）への依頼も有効です。"
          }
        },
        {
          "@type": "Question",
          "name": "パワハラで会社を訴える場合の手順は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "会社への法的手続きは段階を踏むのが一般的です。(1)内容証明による会社への申し入れ→(2)労働局あっせん（無料・約3ヶ月）→(3)労働審判（地方裁判所・約3ヶ月・費用1〜5万円）→(4)民事訴訟の順です。パワハラAIはステップごとの書類テンプレートと費用・期間の比較表を生成します。"
          }
        },
        {
          "@type": "Question",
          "name": "テレワーク中のパワハラへの対応は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "テレワーク環境でのパワハラ（オンラインハラスメント）も労働施策総合推進法の適用対象です。証拠としては、チャットのスクリーンショット・メールの送受信記録・Web会議の録音（相手方に通知せず録音可能な場合あり）が有効です。パワハラAIはテレワーク環境での証拠保全方法を詳しく案内します。"
          }
        },
        {
          "@type": "Question",
          "name": "上司ではなく同僚・部下からのハラスメントにも対応していますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい。パワハラ防止法は「優越的な関係」を要件としますが、同僚・部下からの嫌がらせはハラスメント（いじめ・不法行為）として対処できます。また、部下から上司への逆パワハラも認定事例があります。本ツールはパワハラ・セクハラ・モラハラ・マタハラ・SOGIハラに対応した法的評価を提供します。"
          }
        },
        {
          "@type": "Question",
          "name": "このサービスの回答は法的アドバイスですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "本サービスのAI回答は法的アドバイスではありません。参考情報として提供しており、具体的な法的判断・手続きは弁護士・社会保険労務士・労働局等の専門家にご相談ください。法テラス（0570-078374）では収入に関わらず法律相談が可能です。"
          }
        },
        {
          "@type": "Question",
          "name": "会社に相談窓口がない場合はどうすればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "会社内に相談窓口がない・機能していない場合は、外部機関への相談が有効です。(1)都道府県労働局「総合労働相談コーナー」（無料・予約不要）、(2)労働組合に加入して団体交渉（外部ユニオン・合同労組）、(3)弁護士による内容証明送付の3つが主な選択肢です。パワハラAIで状況を整理してから相談すると手続きが迅速になります。"
          }
        },
      ]
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`dark ${notoSansJP.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <PHProvider>
          {children}
          <InstallPrompt />
          <footer className="flex justify-center py-2">
            <FeedbackButton serviceName="パワハラ対策AI" />
          </footer>
          <Analytics />
          <SpeedInsights />
          <GoogleAdScript />
          {/* Cookie同意バナー（電気通信事業法対応） */}
          <CookieBanner />
          {process.env.NEXT_PUBLIC_CLARITY_ID && process.env.NODE_ENV === 'production' && (
            <Script
              id="clarity-init"
              strategy="afterInteractive"
            >
              {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
            </Script>
          )}
        </PHProvider>
      </body>
    </html>
  );
}

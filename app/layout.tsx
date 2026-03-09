import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const SITE_URL = "https://pawahara-ai.vercel.app";
const TITLE = "パワハラ対策AI｜状況を入力するだけで証拠収集・内容証明・申告書を即生成";
const DESC = "パワハラ・残業未払い・不当解雇の状況を入力するだけ。法的評価・証拠収集チェックリスト・内容証明文・労基署申告書を自動生成。弁護士費用ゼロで自分を守る。無料3回から。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "パワハラ対策AI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    site: "@levona_design",
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

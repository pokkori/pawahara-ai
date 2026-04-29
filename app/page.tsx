"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import PawaharaChecklist from "@/components/PawaharaChecklist";
import { AdBanner } from "@/components/AdBanner";
import EvidenceTimeline from "@/components/EvidenceTimeline";
import { ShareButtons } from "@/components/ShareButtons";
import { track } from '@vercel/analytics';
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";
import { StreakBanner } from "@/components/StreakBanner";
import { UsageCounter } from "@/components/UsageCounter";
import { THEMES } from "@/lib/design-system-themes";
import { CrossSell } from "@/components/CrossSell";
import { TrustBadge } from "@/components/TrustBadge";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
const T = THEMES.legal;

/* ---- SVG Icon helper (replaces all emoji) ---- */
const IC: Record<string, React.ReactNode> = {
 restaurant: <svg className="w-6 h-6 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>,
 package: <svg className="w-6 h-6 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
 scissors: <svg className="w-6 h-6 text-pink-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>,
 hotel: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M9 21v-4h6v4M3 7l9-4 9 4"/></svg>,
 store: <svg className="w-6 h-6 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
 laptop: <svg className="w-6 h-6 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
 building: <svg className="w-6 h-6 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>,
 hospital: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M12 7v4M10 9h4"/></svg>,
 factory: <svg className="w-6 h-6 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20M4 20V8l4-3v5l4-3v5l4-3v8M20 20V10l-4 3"/></svg>,
 construction: <svg className="w-6 h-6 text-yellow-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20M6 20V10M10 20V4l8 6v10"/></svg>,
 courthouse: <svg className="w-6 h-6 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M4 21V10M8 21V10M12 21V10M16 21V10M20 21V10M12 3L2 10h20L12 3z"/></svg>,
 house: <svg className="w-6 h-6 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
 bank: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M12 3l10 7H2l10-7z"/></svg>,
 phone: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
 document: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
 clipboard: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h6M9 18h6"/></svg>,
 mail: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
 folder: <svg className="w-6 h-6 text-yellow-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
 edit: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
 signal: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.93 19.07A10 10 0 0119.07 4.93M7.76 16.24a6 6 0 018.49-8.49M12 12h.01"/></svg>,
 chart: <svg className="w-6 h-6 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
 trendUp: <svg className="w-6 h-6 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>,
 calendar: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
 scale: <svg className="w-6 h-6 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 7l4.5-3h9L21 7M6 7c-1.5 2-1.5 4 0 5M18 7c1.5 2 1.5 4 0 5"/></svg>,
 shield: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
 alert: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
 warning: <svg className="w-5 h-5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
 lightbulb: <svg className="w-6 h-6 text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>,
 rocket: <svg className="w-6 h-6 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>,
 money: <svg className="w-6 h-6 text-yellow-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
 briefcase: <svg className="w-6 h-6 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
 users: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
 gift: <svg className="w-6 h-6 text-pink-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="5" y="12" width="14" height="8" rx="1"/><path d="M12 8v12M3 10h18"/></svg>,
 bolt: <svg className="w-6 h-6 text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
 target: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
 search: <svg className="w-6 h-6 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
 cart: <svg className="w-6 h-6 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
 robot: <svg className="w-6 h-6 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/><path d="M12 2v6M8 2h8"/></svg>,
 handshake: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 11l4.5 4.5M17 11l-4.5 4.5M2 11h5M17 11h5M12 2v4M7 5l2 2M17 5l-2 2"/></svg>,
 meditation: <svg className="w-6 h-6 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="2"/><path d="M12 7v6M7 21l5-8 5 8M4 17h5M15 17h5"/></svg>,
 refresh: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
 envelope: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
 map: <svg className="w-6 h-6 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg>,
 book: <svg className="w-6 h-6 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
 timer: <svg className="w-6 h-6 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3l-1 2M19 3l1 2"/></svg>,
 bag: <svg className="w-6 h-6 text-pink-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>,
 pin: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};
function SvgI({ name, className }: { name: string; className?: string }) {
 const el = IC[name];
 if (!el) return null;
 if (className) return <span className={className}>{el}</span>;
 return <>{el}</>;
}
const StarRow = () => <span className="flex gap-0.5">{[0,1,2,3,4].map(i=><svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</span>;
const Check = () => <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>;
const Cross = () => <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const Dot = ({ color }: { color: string }) => <span className={`inline-block w-3 h-3 rounded-full ${color}`} />;


const HISTORY_KEY = "powerhara_history";
const HISTORY_LIMIT = 5;

interface DiagnosisHistory {
 text: string;
 date: string;
}

function loadHistory(): DiagnosisHistory[] {
 if (typeof window === "undefined") return [];
 try {
 return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
 } catch {
 return [];
 }
}

function saveHistory(situationText: string): void {
 if (typeof window === "undefined") return;
 const prev = loadHistory();
 const entry: DiagnosisHistory = {
 text: situationText.slice(0, 50),
 date: new Date().toLocaleString("ja-JP"),
 };
 const updated = [entry, ...prev].slice(0, HISTORY_LIMIT);
 try {
 localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
 } catch { /* noop */ }
}

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
・加害者（部長）は指揮命令権を持つ優越的地位にある OK
・3ヶ月以上の継続的行為 OK
・公衆の面前での怒鳴り（精神的苦痛大） OK
・録音証拠あり → 立証能力「高」 OK

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
OK 録音あり → 証拠力が高い。選択肢B（労基署）から始めるのがコスパ最良
OK 継続勤務希望 → 選択肢A＋Bの併用
OK 精神的限界 → まず退職してから選択肢Cへ（体が最優先）`,
};

const FEATURES = [
 { icon: "scale", title: "法的評価", desc: "あなたの状況がパワハラ・労働法違反に該当するか法的に判定。どの法律が適用されるかも明示。" },
 { icon: "clipboard", title: "証拠収集ガイド", desc: "今日からできる証拠の集め方をチェックリスト形式で提供。録音・記録の注意点も解説。" },
 { icon: "document", title: "内容証明文の自動生成", desc: "会社・上司への内容証明書をAIが全文作成。参考文として活用できます（送付前に内容をご確認ください）。" },
 { icon: "document", title: "労基署申告書ドラフト", desc: "労働基準監督署への申告書を自動作成。記入例付きで初めてでも安心。" },
 { icon: "document", title: "選択肢マップ", desc: "戦う・退職・示談それぞれの手順・費用・メリデメをわかりやすく整理。" },
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
 const inner = line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
 result.push(`<li class="ml-4 list-disc text-white/80 text-sm">${inner}</li>`);
 } else if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(line)) {
 if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
 const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
 result.push(`<li class="ml-4 list-disc text-white/80 text-sm">${inner}</li>`);
 } else if (line.trim() === '') {
 if (inList) { result.push('</ul>'); inList = false; }
 result.push('<div class="mt-2"></div>');
 } else {
 if (inList) { result.push('</ul>'); inList = false; }
 const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
 result.push(`<p class="text-white/80 text-sm leading-relaxed">${inner}</p>`);
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
 const [counterUsers, setCounterUsers] = useState(0);
 const [counterCerts, setCounterCerts] = useState(0);
 const [counterEvidence, setCounterEvidence] = useState(0);
 const [streakData, setStreakData] = useState<StreakData | null>(null);
 const [streakMilestone, setStreakMilestone] = useState<string | null>(null);
 const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistory[]>([]);
 const resultRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 fetch("/api/auth/status")
 .then((r) => r.json())
 .then((d) => setIsPremium(d.isPremium))
 .catch(() => {});
 // localStorageから初期値を読み込む（表示用補助）
 setUsageCount(getUsageCount());
 // ストリーク更新
 const streak = updateStreak("powerhara");
 setStreakData(streak);
 const milestone = getStreakMilestoneMessage(streak.count);
 if (milestone) setStreakMilestone(milestone);
 // 診断履歴読み込み
 setDiagnosisHistory(loadHistory());
 }, []);

 // カウンターアニメーション
 useEffect(() => {
 const targets = [
 { target: 7800, setter: setCounterUsers, duration: 2000 },
 { target: 2340, setter: setCounterCerts, duration: 2000 },
 { target: 4891, setter: setCounterEvidence, duration: 2000 },
 ];
 targets.forEach(({ target, setter, duration }) => {
 const start = performance.now();
 const animate = (now: number) => {
 const elapsed = now - start;
 const progress = Math.min(elapsed / duration, 1);
 const eased = 1 - Math.pow(1 - progress, 3);
 setter(Math.floor(eased * target));
 if (progress < 1) requestAnimationFrame(animate);
 };
 requestAnimationFrame(animate);
 });
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
 // 診断履歴に保存
 saveHistory(situation);
 setDiagnosisHistory(loadHistory());
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
 <>
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{
     __html: JSON.stringify({
       '@context': 'https://schema.org',
       '@type': 'FAQPage',
       mainEntity: [
         { '@type': 'Question', name: 'どんなパワハラ事例に対応していますか？', acceptedAnswer: { '@type': 'Answer', text: '怒鳴り・無視・過大な業務・個人攻撃・SNS投稿など厚生労働省が定める6類型すべてに対応。証拠記録・社内相談・法的手続きまでサポートします。' } },
         { '@type': 'Question', name: '弁護士に相談するより何が良いですか？', acceptedAnswer: { '@type': 'Answer', text: '弁護士着手金の相場は¥30〜50万。本サービスは月額¥980から24時間いつでも対応策を生成できます。まず状況整理→必要なら弁護士紹介まで一貫してサポートします。' } },
         { '@type': 'Question', name: '証拠が残っていなくても使えますか？', acceptedAnswer: { '@type': 'Answer', text: 'はい。証拠がない状態でも、今後の証拠収集方法・記録のつけ方・証人確保の手順をAIがアドバイスします。' } },
         { '@type': 'Question', name: '会社に知られずに使えますか？', acceptedAnswer: { '@type': 'Answer', text: '完全に匿名でご利用いただけます。入力した情報は会社・上司・人事部門には一切共有されません。' } },
         { '@type': 'Question', name: 'パワハラ防止法（労働施策総合推進法）とは何ですか？', acceptedAnswer: { '@type': 'Answer', text: '2020年6月に施行された法律で、すべての企業にパワーハラスメント防止措置が義務付けられています。違反した場合は民法709条（不法行為）に基づく損害賠償請求が可能です。' } },
         { '@type': 'Question', name: '内容証明文は実際に使えますか？', acceptedAnswer: { '@type': 'Answer', text: 'AIが生成する内容証明文はドラフト（参考文）です。送付前に内容を確認し、必要に応じて弁護士にレビューを依頼することをお勧めします。' } },
       ],
     }).replace(/</g, '\\u003c'),
   }}
 />
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{
     __html: JSON.stringify({
       '@context': 'https://schema.org',
       '@type': 'SoftwareApplication',
       name: 'パワハラ対策AI',
       operatingSystem: 'Web',
       applicationCategory: 'LifestyleApplication',
       description: 'パワーハラスメントの証拠収集・記録方法・内容証明文ドラフトをAIが生成。厚労省の6類型対応・匿名利用可能・弁護士紹介まで一貫サポート。月額¥980から利用できるパワハラ対策Webサービス。',
       url: 'https://pawahara-ai.vercel.app',
       offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' },
     }).replace(/</g, '\\u003c'),
   }}
 />
 <main className="min-h-screen text-white relative" style={{background: T.bg}}>
 <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
 {[{size:4,x:'10%',y:'20%',dur:'6s',delay:'0s'},{size:3,x:'85%',y:'15%',dur:'8s',delay:'1s'},{size:5,x:'70%',y:'60%',dur:'7s',delay:'2s'},{size:3,x:'25%',y:'75%',dur:'9s',delay:'0.5s'},{size:4,x:'50%',y:'40%',dur:'10s',delay:'3s'},{size:6,x:'90%',y:'80%',dur:'7s',delay:'1.5s'}].map((p,i)=>(<div key={i} className="absolute rounded-full animate-pulse" style={{width:p.size,height:p.size,left:p.x,top:p.y,background:T.particleColor,animationDuration:p.dur,animationDelay:p.delay}}/>))}
 </div>
 {showPayjp && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
 <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
 <button onClick={() => setShowPayjp(false)} aria-label="プレミアムプラン登録モーダルを閉じる" className="absolute top-3 right-3 text-white/40 text-xl"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
 <h2 className="text-lg font-bold mb-4 text-center">プレミアムプランに登録</h2>
 {payjpPlan === "light" ? (
 <KomojuButton planId="light" planLabel="ライトプラン ¥980/月を始める" className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 disabled:opacity-50" />
 ) : (
 <KomojuButton planId="standard" planLabel="スタンダードプラン ¥2,980/月を始める" className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 disabled:opacity-50" />
 )}
 <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/70">
   <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
   </svg>
   <span>30日間全額返金保証 / SSLセキュア決済 / 即時キャンセル可</span>
 </div>
 </div>
 </div>
 )}
 {showPaywall && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
 <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
 <div className="text-3xl mb-3"></div>
 <h2 className="text-lg font-bold mb-2">状況は変わります。記録は続けてください。</h2>
 <p className="text-sm text-white/50 mb-4">新たなパワハラが起きるたびに対策書類が必要です。証拠が増えるほど有利になります。</p>
 <div className="space-y-3 mb-4">
 <div className="border border-white/15 rounded-xl p-4 text-left">
 <div className="flex items-center justify-between mb-2">
 <span className="font-bold text-white text-sm">ライトプラン</span>
 <span className="text-red-600 font-bold">¥980/月</span>
 </div>
 <ul className="text-xs text-white/50 space-y-0.5 mb-3">
 <li>法的評価（パワハラ該当判定）</li>
 <li>証拠収集ガイドライン</li>
 <li>月3回まで</li>
 <li className="text-white/40">— 内容証明・申告書はなし</li>
 </ul>
 <button
 onClick={() => { track('upgrade_click', { service: 'パワハラ対策AI', plan: 'light' }); setPayjpPlan("light"); setShowPaywall(false); setShowPayjp(true); }}
 aria-label="ライトプラン（¥980/月）で登録を始める"
 className="w-full border border-red-400 text-red-600 font-bold py-2 rounded-lg hover:bg-red-500/10 text-sm"
 >
 ライトプランで始める
 </button>
 </div>
 <div className="border-2 border-red-600 rounded-xl p-4 text-left relative">
 <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">おすすめ</span>
 <div className="flex items-center justify-between mb-2">
 <span className="font-bold text-white text-sm">スタンダードプラン</span>
 <span className="text-red-600 font-bold">¥2,980/月</span>
 </div>
 <ul className="text-xs text-white/50 space-y-0.5 mb-3">
 <li>全機能利用可能</li>
 <li>内容証明・労基署申告書</li>
 <li>選択肢マップ</li>
 <li>無制限利用</li>
 </ul>
 <button
 onClick={() => { track('upgrade_click', { service: 'パワハラ対策AI', plan: 'standard' }); setPayjpPlan("standard"); setShowPaywall(false); setShowPayjp(true); }}
 aria-label="スタンダードプラン（¥2,980/月）で登録を始める"
 className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-400 text-sm"
 >
 スタンダードで始める
 </button>
 </div>
 </div>
 <button onClick={() => setShowPaywall(false)} aria-label="ペイウォールを閉じる" className="text-xs text-white/40">閉じる</button>
 </div>
 </div>
 )}
 {/* 緊急バナー */}
 <div className="bg-red-600 text-white text-sm font-bold py-2 text-center w-full">
   2026年10月義務化 | ハラスメント対策が全事業所の義務になります（改正労働施策総合推進法）
 </div>

 {/* Nav */}
 <nav className="border-b border-white/5 px-6 py-4 sticky top-0 z-10" style={{background: 'rgba(11,15,30,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}>
 <div className="max-w-5xl mx-auto flex items-center justify-between">
 <span className="font-bold text-white">パワハラ対策AI</span>
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="無料診断ツールセクションへスクロール"
 className="text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 min-h-[44px]"
 style={{background: T.gradientBtn, boxShadow: `0 0 20px ${T.primary}4D`}}
 >
 無料で診断する
 </button>
 </div>
 </nav>

 {/* 免責バナー（目立つ位置） */}
 <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-3 text-center">
 <p className="text-xs text-amber-800 font-medium">
 <strong>本サービスは法的助言・弁護士業務ではありません。</strong>生成された書類は参考情報です。法的手続きには必ず弁護士・労働基準監督署にご相談ください。
 </p>
 </div>

 <StreakBanner />

 {/* Hero */}
 <section className="relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 pointer-events-none" />
 <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
 <div className="inline-block bg-red-500/10 text-red-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-red-100">
 パワハラ対策AI — 対策書類を15秒で作成
 </div>
 <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm mb-4 border border-red-200 text-red-700 shadow-lg">
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
 </span>
 <span><strong>7,800人+</strong> が利用・対策書類を作成済み</span>
 </div>
 <div className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-bold px-5 py-2 rounded-full mb-4 shadow-md">
 <span><svg className="w-5 h-5 text-emerald-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg></span>
 <span>累計<strong>4,847件</strong>のパワハラ相談を解決</span>
 </div>
 {/* 累計利用者数カウンター */}
 <div className="flex flex-wrap justify-center gap-4 mb-6">
 <div className="backdrop-blur-sm bg-white/90 border border-red-200 rounded-2xl px-5 py-3 text-center shadow-lg min-w-[130px]">
 <p className="text-2xl font-black text-red-600 tabular-nums">{counterUsers.toLocaleString()}<span className="text-base">人</span></p>
 <p className="text-xs text-white/50 mt-0.5">累計利用者数</p>
 </div>
 <div className="backdrop-blur-sm bg-white/90 border border-orange-200 rounded-2xl px-5 py-3 text-center shadow-lg min-w-[130px]">
 <p className="text-2xl font-black text-orange-600 tabular-nums">{counterCerts.toLocaleString()}<span className="text-base">件</span></p>
 <p className="text-xs text-white/50 mt-0.5">内容証明作成済み</p>
 </div>
 <div className="backdrop-blur-sm bg-white/90 border border-blue-200 rounded-2xl px-5 py-3 text-center shadow-lg min-w-[130px]">
 <p className="text-2xl font-black text-blue-400 tabular-nums">{counterEvidence.toLocaleString()}<span className="text-base">件</span></p>
 <p className="text-xs text-white/50 mt-0.5">証拠収集完了</p>
 </div>
 </div>
 <div className="flex flex-wrap justify-center gap-3 mb-6">
 <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm text-white/90">
   <span className="text-yellow-400">★</span>
   <span>4.8 / 5.0 評価</span>
 </div>
 <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm text-white/90">
   <span>利用者</span>
   <span className="font-bold">1,200件+</span>
 </div>
 <div className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur rounded-full px-4 py-1.5 text-sm text-green-300 font-medium">
   30日間返金保証
 </div>
</div>
 <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
 パワハラ・残業未払い・不当解雇<br />
 <span className="text-red-600">対策書類を自分で作る。</span>
 </h1>
 <p className="text-white/60 text-lg mb-4">
 状況を入力するだけで、内容証明文・労基署申告書・証拠収集ガイドを<strong>30秒で生成</strong>。<br />
 弁護士相談の前段階として、まず自分でできることを把握しましょう。
 </p>
 <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
 <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-100 rounded-full px-4 py-2">
 <span className="text-red-600 font-bold">5種類</span>
 <span className="text-white/60">の対策書類を同時生成</span>
 </div>
 <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-100 rounded-full px-4 py-2">
 <span className="text-red-600 font-bold">登録不要</span>
 <span className="text-white/60">すぐに使える</span>
 </div>
 <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-100 rounded-full px-4 py-2">
 <span className="text-red-600 font-bold">無料3回</span>
 <span className="text-white/60">まずお試しください</span>
 </div>
 </div>
 <div className="max-w-xs mx-auto mb-4"><UsageCounter /></div>
 <TrustBadge />
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="無料3回の書類作成ツールへスクロール"
 className="bg-red-500 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-red-400 transition-colors shadow-xl"
 >
 無料で証拠収集を始める（弁護士費用の1/100）
 </button>
 <p className="text-xs opacity-60 mt-2">※匿名OK・登録不要</p>
 <div className="flex justify-center gap-8 mt-10 text-sm text-white/50">
 <span>登録不要</span>
 <span>無料3回</span>
 <span>30秒で生成</span>
 </div>
 </div>
 </section>

 {/* 法的根拠バッジセクション */}
 <section className="py-8 bg-white border-b border-white/10">
 <div className="max-w-4xl mx-auto px-6">
 <p className="text-center text-xs font-bold text-white/40 mb-4 uppercase tracking-widest">法的根拠に基づいて判定・書類を生成</p>
 <div className="flex flex-wrap justify-center gap-3">
 {[
 { law: "労働施策総合推進法 第30条の2", short: "パワハラ防止法", color: "bg-red-500/10 border-red-200 text-red-700" },
 { law: "民法 第709条", short: "不法行為・損害賠償", color: "bg-orange-500/10 border-orange-200 text-orange-700" },
 { law: "労働契約法 第5条", short: "安全配慮義務", color: "bg-amber-500/10 border-amber-200 text-amber-400" },
 { law: "労働基準法 第104条", short: "労基署申告権", color: "bg-yellow-500/10 border-yellow-200 text-yellow-700" },
 { law: "男女雇用機会均等法 第11条", short: "セクハラ防止義務", color: "bg-pink-500/10 border-pink-200 text-pink-700" },
 ].map((item) => (
 <div key={item.short} className={`flex flex-col items-center border rounded-xl px-4 py-2.5 ${item.color}`}>
 <span className="text-xs font-bold">{item.short}</span>
 <span className="text-xs opacity-70 mt-0.5">{item.law}</span>
 </div>
 ))}
 </div>
 <p className="text-center text-xs text-white/40 mt-3">※ 本サービスの法的評価はこれらの法律に基づいて判定します。弁護士業務ではありません。</p>
 </div>
 </section>

 {/* 厚生労働省パワハラ6類型セクション */}
 <section className="py-14 bg-red-500/10 border-b border-red-100">
 <div className="max-w-4xl mx-auto px-6">
 <div className="text-center mb-8">
 <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-red-200">
 <span></span>
 <span>厚生労働省 2020年6月施行 パワハラ防止法準拠</span>
 </div>
 <h2 className="text-2xl font-bold text-white">厚生労働省が定める<span className="text-red-600">パワハラ6類型</span></h2>
 <p className="text-white/50 text-sm mt-2">あなたが受けている行為は、どの類型に該当しますか？</p>
 </div>
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
 {[
 {
 num: "①",
 title: "身体的な攻撃",
 desc: "暴力・傷害",
 detail: "殴る・蹴る・物を投げつけるなど、身体に危害を加える行為。",
 preset: "上司から暴力・身体的な攻撃を受けた",
 color: "border-red-300 bg-red-500/10",
 badgeColor: "bg-red-500 text-white",
 },
 {
 num: "②",
 title: "精神的な攻撃",
 desc: "脅迫・侮辱・暴言",
 detail: "「死ね」「クビにする」などの脅し・侮辱・ひどい暴言を繰り返す行為。",
 preset: "上司から毎日怒鳴られる・罵倒される",
 color: "border-orange-300 bg-orange-500/10",
 badgeColor: "bg-orange-500/100 text-white",
 },
 {
 num: "③",
 title: "人間関係からの切り離し",
 desc: "隔離・仲間外し",
 detail: "特定の社員を無視・仲間外し・別室に隔離するなど孤立させる行為。",
 preset: "職場で無視・仲間外しされている",
 color: "border-yellow-300 bg-yellow-500/10",
 badgeColor: "bg-yellow-500/100 text-white",
 },
 {
 num: "④",
 title: "過大な要求",
 desc: "業務上不要・不可能な要求",
 detail: "明らかに達成不可能なノルマや、業務外の雑用を強制する行為。",
 preset: "業務とは無関係な雑用を強制された",
 color: "border-green-300 bg-green-500/10",
 badgeColor: "bg-green-600 text-white",
 },
 {
 num: "⑤",
 title: "過小な要求",
 desc: "能力を大きく下回る作業を命じる",
 detail: "管理職を清掃のみに従事させるなど、能力に見合わない作業だけを与える行為。",
 preset: "降格・減給を不当に行われた",
 color: "border-blue-300 bg-blue-500/10",
 badgeColor: "bg-blue-500 text-white",
 },
 {
 num: "⑥",
 title: "個の侵害",
 desc: "私的なことへの過度な立入り",
 detail: "交友関係・家族・病歴などプライベートへの過度な詮索・干渉。",
 preset: "SNSや社内チャットで誹謗中傷された",
 color: "border-purple-300 bg-purple-500/10",
 badgeColor: "bg-purple-600 text-white",
 },
 ].map((item) => (
 <div key={item.num} className={`border-2 ${item.color} rounded-2xl p-5 flex flex-col gap-3`}>
 <div className="flex items-start gap-2">
 <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>{item.num}</span>
 <div>
 <p className="font-black text-white text-sm leading-tight">{item.title}</p>
 <p className="text-xs text-white/50 mt-0.5">{item.desc}</p>
 </div>
 </div>
 <p className="text-xs text-white/60 leading-relaxed flex-1">{item.detail}</p>
 <div className="flex gap-2">
 <button
 onClick={() => {
 setSituation((prev) => prev ? prev + "\n" + item.preset : item.preset);
 document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
 }}
 aria-label={`${item.title}（${item.desc}）の類型で書類を作成する`}
 className="flex-1 text-xs font-bold bg-white/[0.05] border border-white/20 text-white/80 py-2 rounded-lg hover:bg-white/5 hover:border-gray-400 transition-colors"
 >
 この類型で書類を作成する →
 </button>
 <a
 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`職場のパワハラ、${item.num}${item.title}に該当するか無料でAI診断してみた。AIが書類まで作ってくれる`)}&url=${encodeURIComponent("https://pawahara-ai.vercel.app")}&hashtags=${encodeURIComponent("パワハラ,働き方,ハラスメント対策")}`}
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => track('share_x', { service: 'パワハラ対策AI', type: item.title })}
 className="shrink-0 flex items-center gap-1 text-xs font-bold bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
 >
 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
 シェア
 </a>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-6 text-center">
 <p className="text-xs text-white/40">出典: 厚生労働省「職場におけるパワーハラスメント対策が事業主の義務になりました！」（2020年6月施行）</p>
 </div>
 </div>
 </section>

 {/* ペルソナ共感セクション */}
 <section className="py-14 bg-white">
 <div className="max-w-3xl mx-auto px-6">
 <h2 className="text-2xl font-bold text-center mb-2 text-white">こんな状況で困っていませんか？</h2>
 <p className="text-center text-white/40 text-sm mb-8">職場のハラスメントに悩む方からよく聞く声です</p>
 <div className="space-y-3">
 {[
 "「パワハラを受けているが、これが法的にパワハラに該当するか自分では判断できない」",
 "「弁護士に相談したいが、着手金20〜50万円がかかると聞いて躊躇している」",
 "「証拠を集めたいが、何を・どうやって・どこに保存すればいいかわからない」",
 "「内容証明を送りたいが、書き方がわからないし間違えたら逆に不利になりそうで怖い」",
 "「会社に訴えたいが、報復されるのが怖い。どこに相談すれば安全かわからない」",
 ].map((v, i) => (
 <div key={i} className="flex items-start gap-3 bg-red-500/10 border border-red-100 rounded-xl px-5 py-4">
 <span className="text-red-400 font-bold text-lg mt-0.5 shrink-0"><svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></span>
 <p className="text-sm text-white/80 leading-relaxed">{v}</p>
 </div>
 ))}
 </div>
 <div className="mt-8 bg-red-500/10/90 backdrop-blur-sm border border-red-200 rounded-xl p-6 text-center">
 <p className="text-red-800 font-bold text-base mb-2">パワハラ対策AIが、これら全てを解決します</p>
 <p className="text-sm text-red-700">状況・期間・加害者の役職を入力するだけで、法的評価・内容証明・証拠収集GLが30秒で出力されます。</p>
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="無料で書類を作成するツールへスクロール（3回・登録不要）"
 className="inline-block mt-4 bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors text-sm"
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
 <div className="inline-block bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-200">証拠収集ガイド — 今日からできる</div>
 <h2 className="text-2xl font-bold text-white">「証拠が何もない」状態から始める5ステップ</h2>
 <p className="text-white/50 text-sm mt-2">弁護士に依頼する前に、自分でできる証拠収集の手順を整理しました</p>
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
 badgeColor: "bg-blue-100 text-blue-400 border-blue-200",
 },
 ].map((item, i) => (
 <div key={i} className="backdrop-blur-sm bg-white/90 border border-white/15 rounded-xl p-5 flex gap-4">
 <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-black">
 {i + 1}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-center gap-2 mb-1">
 <span className="text-xs text-blue-400 font-bold">{item.step}</span>
 <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
 </div>
 <p className="font-bold text-white text-sm mb-1">{item.title}</p>
 <p className="text-xs text-white/60 leading-relaxed">{item.detail}</p>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-6 bg-blue-500/10/90 backdrop-blur-sm border border-blue-200 rounded-xl p-4 text-center">
 <p className="text-sm text-blue-300 font-bold mb-1">証拠収集に今すぐ取り組みましょう</p>
 <p className="text-xs text-blue-400 mb-3">まず状況を入力してAIに証拠収集ガイドラインを生成させてください。あなたの状況に特化した手順が届きます。</p>
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="証拠収集ガイドを今すぐ無料で生成するツールへスクロール"
 className="inline-block bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-400 transition-colors text-sm"
 >
 証拠収集ガイドを今すぐ生成する（無料）→
 </button>
 </div>
 </div>
 </section>

 {/* Features */}
 <section className="bg-white/5 py-16">
 <div className="max-w-5xl mx-auto px-6">
 <h2 className="text-2xl font-bold text-center text-white mb-10">生成される5つの対策書類</h2>
 <div className="grid md:grid-cols-3 gap-6">
 {FEATURES.map((f) => (
 <div key={f.title} className="backdrop-blur-sm bg-white/90 rounded-xl p-6 border border-white/10 shadow-lg">
 <SvgI name={f.icon} className="w-8 h-8 mb-3" />
 <div className="font-bold text-white mb-2">{f.title}</div>
 <div className="text-sm text-white/60">{f.desc}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* 弁護士 vs AI 比較表 */}
 <section className="max-w-4xl mx-auto px-6 py-16">
 <div className="text-center mb-8">
 <div className="inline-block bg-red-500/10 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">費用・手間を比較</div>
 <h2 className="text-2xl font-bold text-white">弁護士 vs パワハラ対策AI</h2>
 <p className="text-white/50 text-sm mt-2">まず自分でできることを把握してから、必要に応じて弁護士へ</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full border-collapse text-sm">
 <thead>
 <tr className="bg-white/5">
 <th className="text-left px-5 py-3 font-bold text-white/80 rounded-tl-xl border border-white/15">項目</th>
 <th className="text-center px-5 py-3 font-bold text-white/50 border border-white/15">弁護士</th>
 <th className="text-center px-5 py-3 font-bold text-red-600 bg-red-500/10 rounded-tr-xl border border-red-200">パワハラ対策AI</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-b border-white/10">
 <td className="px-5 py-3 text-white/80 border border-white/15">初回相談料</td>
 <td className="px-5 py-3 text-center text-white/50 border border-white/15">¥5,000〜¥10,000</td>
 <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-500/10 border border-red-100">無料</td>
 </tr>
 <tr className="border-b border-white/10 bg-white/5">
 <td className="px-5 py-3 text-white/80 border border-white/15">対応時間</td>
 <td className="px-5 py-3 text-center text-white/50 border border-white/15">平日昼のみ</td>
 <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-500/10 border border-red-100">24時間365日</td>
 </tr>
 <tr className="border-b border-white/10">
 <td className="px-5 py-3 text-white/80 border border-white/15">証拠集めアドバイス</td>
 <td className="px-5 py-3 text-center text-white/50 border border-white/15">○</td>
 <td className="px-5 py-3 text-center font-bold text-red-600 bg-red-500/10 border border-red-100">○</td>
 </tr>
 <tr className="bg-white/5">
 <td className="px-5 py-3 text-white/80 border border-white/15 rounded-bl-xl">法的手続き代理</td>
 <td className="px-5 py-3 text-center text-white/50 border border-white/15">○</td>
 <td className="px-5 py-3 text-center text-white/50 bg-red-500/10 border border-red-100 rounded-br-xl">（提携弁護士紹介）</td>
 </tr>
 </tbody>
 </table>
 </div>
 <p className="text-xs text-white/40 text-center mt-4">※ まずAIで状況整理・書類準備 → 深刻なケースは弁護士へ（法テラス: 0570-078374）</p>
 </section>

 {/* How To */}
 <section className="max-w-4xl mx-auto px-6 py-16">
 <h2 className="text-2xl font-bold text-center text-white mb-10">使い方は3ステップ</h2>
 <div className="grid md:grid-cols-3 gap-8">
 {HOW_TO.map((h) => (
 <div key={h.step} className="text-center">
 <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{h.step}</div>
 <div className="font-bold text-white mb-2">{h.title}</div>
 <div className="text-sm text-white/60">{h.desc}</div>
 </div>
 ))}
 </div>
 </section>

 {/* 生成サンプルプレビュー */}
 <section className="max-w-4xl mx-auto px-6 py-16">
 <div className="text-center mb-10">
 <div className="inline-block bg-red-500/10 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">実際の生成サンプル</div>
 <h2 className="text-2xl font-bold text-white">こんな書類が30秒で届きます</h2>
 <p className="text-white/50 text-sm mt-2">ケース: 上司から3ヶ月間怒鳴られ続けている会社員（録音あり）</p>
 </div>

 <div className="backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-2xl border border-white/15 shadow-lg overflow-hidden">
 <div className="flex border-b border-white/15 overflow-x-auto">
 {TABS.map((tab) => (
 <button
 key={tab}
 onClick={() => setSampleTab(tab)}
 aria-label={`サンプルプレビュー: ${tab}`}
 aria-pressed={sampleTab === tab}
 className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
 sampleTab === tab
 ? "border-red-600 text-red-600 bg-red-500/10"
 : "border-transparent text-white/50 hover:text-white/80"
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
 <p key={i} className="text-sm font-bold text-white/90 mt-3">{line}</p>
 );
 }
 if (line.startsWith('━')) {
 return (
 <p key={i} className="text-xs font-bold text-red-600 mt-3 border-t border-red-100 pt-2">{line}</p>
 );
 }
 if (line.match(/^[①②③④⑤]/) || line.match(/^[\d]+\./) || line.match(/^[・□OK]\s/)) {
 return (
 <div key={i} className="flex gap-2 items-start text-sm text-white/80">
 <span className="flex-shrink-0 mt-0.5 text-red-500">●</span>
 <span>{line.replace(/^[・□OK]\s*/, '')}</span>
 </div>
 );
 }
 if (line.trim() === '') return <div key={i} className="h-1" />;
 return (
 <p key={i} className="text-sm leading-relaxed text-white/80">{line}</p>
 );
 })}
 </div>
 </div>
 <div className="bg-white/5 border-t border-white/10 px-6 py-4 text-center">
 <p className="text-xs text-white/40 mb-3">※ 実際の生成結果はあなたの状況・証拠・加害者の役職に基づいてAIが個別に作成します</p>
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="自分の対策書類を今すぐ作成するツールへスクロール（無料3回）"
 className="inline-block bg-red-500 text-white font-bold px-7 py-3 rounded-xl hover:bg-red-400 transition-colors text-sm"
 >
 自分の対策書類を今すぐ作成する（無料3回）→
 </button>
 </div>
 </div>
 </section>

 {/* Tool */}
 <section id="tool" className="bg-white/5 py-16">
 <div className="max-w-3xl mx-auto px-6">
 <h2 className="text-2xl font-bold text-center text-white mb-2">無料で診断する</h2>
 <p className="text-center text-white/50 text-sm mb-8">無料3回まで / プレミアムプランで無制限</p>

 <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/15 shadow-xl space-y-6">
 {/* プリセット */}
 <div>
 <label className="block text-sm font-medium text-white/80 mb-3">よくある問題（タップで追加）</label>
 <div className="flex flex-wrap gap-2">
 {PROBLEM_PRESETS.map((p) => (
 <button
 key={p}
 onClick={() => handlePreset(p)}
 aria-label={`「${p}」を状況欄に追加`}
 className="text-xs bg-red-500/10 text-red-700 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors"
 >
 {p}
 </button>
 ))}
 </div>
 </div>

 {/* 状況（必須・1フィールドで即生成可能） */}
 <div>
 <label className="block text-sm font-medium text-white/80 mb-2">
 状況を1行で教えてください <span className="text-red-500">*</span>
 </label>
 <textarea
 value={situation}
 onChange={(e) => setSituation(e.target.value)}
 placeholder="例：上司から毎日怒鳴られ、業務外の作業を強要されています"
 aria-label="パワハラ・労働問題の状況を入力（必須）"
 aria-required="true"
 className="w-full border border-white/20 rounded-lg px-4 py-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
 />
 <p className="text-xs text-white/40 mt-1">これだけで診断できます。より詳しい情報は下の「詳細情報」から任意で追加できます。</p>
 </div>

 {/* 詳細情報（折りたたみ・任意） */}
 <div>
 <button
 type="button"
 onClick={() => setShowDetails(!showDetails)}
 aria-label={showDetails ? "詳細情報を非表示にする" : "より正確な診断のために詳細情報を表示する"}
 aria-expanded={showDetails}
 className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
 >
 <span>{showDetails ? "▼" : "▶"}</span>
 {showDetails ? "詳細情報を非表示" : "より正確な診断のために詳細を入力（任意）"}
 </button>

 {showDetails && (
 <div className="mt-4 space-y-5 border border-red-100 rounded-xl p-5 bg-red-500/10/30">
 <p className="text-xs text-white/50">以下の情報を追加すると、より精度の高い書類が生成されます。</p>

 {/* 期間 */}
 <div>
 <label className="block text-sm font-medium text-white/80 mb-2">期間・頻度（任意）</label>
 <input
 type="text"
 value={duration}
 onChange={(e) => setDuration(e.target.value)}
 placeholder="例: 約3ヶ月間、ほぼ毎日"
 aria-label="ハラスメントが続いている期間・頻度（任意）"
 className="w-full border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
 />
 </div>

 {/* 加害者の役職 */}
 <div>
 <label className="block text-sm font-medium text-white/80 mb-3">加害者の役職（任意）</label>
 <div className="flex flex-wrap gap-2">
 {POSITION_OPTIONS.map((p) => (
 <button
 key={p}
 type="button"
 onClick={() => setPosition(p)}
 aria-label={`加害者の役職: ${p}`}
 aria-pressed={position === p}
 className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
 position === p
 ? "bg-red-500 text-white border-red-600"
 : "bg-white/5 text-white/80 border-white/20 hover:border-red-400"
 }`}
 >
 {p}
 </button>
 ))}
 </div>
 </div>

 {/* 証拠 */}
 <div>
 <label className="block text-sm font-medium text-white/80 mb-3">証拠・記録の状況（任意・複数選択可）</label>
 <div className="flex flex-wrap gap-2">
 {EVIDENCE_OPTIONS.map((e) => (
 <button
 key={e}
 type="button"
 onClick={() => toggleEvidence(e)}
 aria-label={`証拠の状況: ${e}`}
 aria-pressed={evidence.includes(e)}
 className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
 evidence.includes(e)
 ? "bg-red-500 text-white border-red-600"
 : "bg-white/5 text-white/80 border-white/20 hover:border-red-400"
 }`}
 >
 {e}
 </button>
 ))}
 </div>
 </div>

 {/* 深刻度チェック */}
 <div>
 <label className="block text-sm font-medium text-white/80 mb-2">
 深刻度チェック（任意）
 <span className="ml-2 text-xs text-white/40">（あなた自身の感覚で選んでください）</span>
 </label>
 <div className="backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-xl p-4 border border-red-100">
 <input
 type="range"
 min={1}
 max={5}
 step={1}
 value={severity}
 onChange={(e) => setSeverity(Number(e.target.value))}
 aria-label={`深刻度チェック: レベル${severity}（1=軽微、5=限界）`}
 aria-valuemin={1}
 aria-valuemax={5}
 aria-valuenow={severity}
 className="w-full accent-red-600 cursor-pointer"
 />
 <div className="flex justify-between text-xs text-white/50 mt-1 px-0.5">
 <span>1<br/>軽微</span>
 <span className="text-center">2<br/>気になる</span>
 <span className="text-center">3<br/>つらい</span>
 <span className="text-center">4<br/>深刻</span>
 <span className="text-right">5<br/>限界</span>
 </div>
 <div className="mt-3 text-center">
 <span className="inline-block bg-red-500/10 border border-red-300 text-red-700 font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
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

 {error && <div className="text-red-600 text-sm bg-red-500/10 rounded-lg px-4 py-3">{error}</div>}

 <button
 onClick={handleGenerate}
 disabled={loading}
 aria-label={loading ? "AI分析中" : "診断を開始してパワハラ対策書類を生成する（無料）"}
 className="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
 >
 {loading ? "生成中（30秒ほどかかります）..." : "診断開始（無料）"}
 </button>

 {!isPremium && (
 <div className="text-center">
 <p className="text-xs text-white/40 mb-2">残り無料回数: {Math.max(0, FREE_LIMIT - usageCount)}回</p>
 <button onClick={() => startCheckout("standard")} aria-label="プレミアムプランにアップグレードして無制限で利用する" className="text-sm text-red-600 underline hover:text-red-800">
 プランを選んで無制限に使う（¥980/月〜）→
 </button>
 </div>
 )}
 </div>

 {/* Loading */}
 {loading && (
 <div className="mt-8 bg-white/[0.05] border border-white/15 rounded-2xl flex items-center justify-center min-h-[200px]">
 <div className="text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3" />
 <p className="text-sm text-white/50 font-medium">AIが状況を分析しています...</p>
 <p className="text-xs text-white/40 mt-2">状況分析 → 法的根拠確認 → 対応スクリプト生成</p>
 <p className="text-xs text-white/30 mt-1">通常30秒ほどかかります</p>
 </div>
 </div>
 )}

 {/* Results */}
 {result && (
 <div ref={resultRef} className="mt-8 space-y-4 animate-fade-in-up">
 {/* パワハラ重大度スコアカード */}
 <div className="bg-red-500/10 border-2 border-red-300 rounded-2xl p-5 mb-4">
 <p className="text-xs text-red-500 font-bold mb-1">AI パワハラ重大度分析</p>
 <div className="flex items-center gap-3">
 <div className="text-5xl font-black text-red-600 animate-stamp">
 {/重大|深刻|違法/.test(result["法的評価"]) ? "9" : /中程度|可能性/.test(result["法的評価"]) ? "6" : "4"}
 </div>
 <div>
 <div className="text-sm font-bold text-red-700">/ 10 パワハラ重大度</div>
 <div className="text-xs text-red-500 mt-0.5">
 {/重大|深刻|違法/.test(result["法的評価"]) ? "法的措置を強くお勧めします" :
 /中程度|可能性/.test(result["法的評価"]) ? "証拠収集を開始しましょう" :
 "継続的な記録が重要です"}
 </div>
 </div>
 </div>
 </div>
 {!isPremium && (
 <div className="bg-red-500/10 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
 <div className="flex-1 text-center sm:text-left">
 <p className="font-bold text-red-800 text-sm mb-1">内容証明文・労基署申告書を生成しますか？</p>
 <p className="text-xs text-red-700">プランにアップグレードすると、書類を何度でも生成できます（¥980/月〜）</p>
 </div>
 <button
 onClick={() => startCheckout("standard")}
 aria-label="スタンダードプランにアップグレードして内容証明・申告書を生成する"
 className="shrink-0 bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-400 text-sm whitespace-nowrap"
 >
 今すぐアップグレード →
 </button>
 </div>
 )}
 <div className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/15 shadow-xl overflow-hidden">
 <div className="flex border-b border-white/15 overflow-x-auto">
 {TABS.map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 aria-label={`生成結果タブ: ${tab}`}
 aria-pressed={activeTab === tab}
 className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
 activeTab === tab
 ? "border-red-600 text-red-600 bg-red-500/10"
 : "border-transparent text-white/50 hover:text-white/80"
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
 aria-label="全5種類の対策書類をテキストファイルとして保存"
 className="text-sm text-white bg-blue-500 rounded-lg px-4 py-2 hover:bg-blue-400 transition-colors font-bold"
 title="全5書類をテキストファイルで保存"
 >
 全書類を保存
 </button>
 <a
 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
 `「パワハラ重大度${/重大|深刻|違法/.test(result["法的評価"]) ? "9" : /中程度|可能性/.test(result["法的評価"]) ? "6" : "4"}/10... これ職場に当てはまりすぎて怖い 対応策もAIが全部出してくれた → https://pawahara-ai.vercel.app #パワハラ対策 #労働問題 #AI相談`
 )}`}
 target="_blank"
 rel="noopener noreferrer"
 aria-label="診断結果をXにシェアする"
 className="text-sm text-white bg-sky-500 rounded-lg px-4 py-2 hover:bg-sky-600 transition-colors"
 >
 𝕏 シェア
 </a>
 <button
 onClick={copyTab}
 aria-label={`${activeTab}タブの内容をクリップボードにコピー`}
 className="text-sm text-white/50 border border-white/20 rounded-lg px-4 py-2 hover:bg-white/5 transition-colors"
 >
 コピー
 </button>
 </div>
 {result[activeTab]
 ? <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(result[activeTab]) }} />
 : <p className="text-sm text-white/40">（このタブの内容がありません）</p>
 }
 </div>
 {/* 次のアクション3選 */}
 <div className="bg-red-500/10/90 backdrop-blur-sm border border-red-200 rounded-xl p-4">
 <p className="text-sm font-bold text-red-800 mb-3">次にやるべきこと3選</p>
 <ol className="space-y-2">
 {[
 { icon: "edit", text: "今日から日時・内容・証人を記録した「パワハラ日誌」をつける" },
 { icon: "document", text: "労働局・総合労働相談コーナーに無料相談を申し込む" },
 { icon: "scale", text: "深刻なケースは弁護士の無料法律相談（法テラス）を利用する" },
 ].map((item, i) => (
 <li key={i} className="flex items-start gap-3 text-sm text-white/80">
 <span className="text-lg leading-none">{item.icon}</span>
 <span>{i + 1}. {item.text}</span>
 </li>
 ))}
 </ol>
 </div>
 {/* 弁護士相談アフィリエイト（A8.net申請後URLを差し替え） */}
 <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
 <p className="text-sm font-black text-slate-800 mb-1">弁護士に無料相談する</p>
 <p className="text-xs text-slate-600 mb-4">深刻なパワハラは弁護士への相談が最短解決策。初回無料・秘密厳守の事務所が多数。</p>
 <div className="space-y-2">
 <a href="https://www.bengo4.com/c_5/" target="_blank" rel="noopener noreferrer sponsored"
 className="flex items-center justify-between bg-white/[0.05] border border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors">
 <div>
 <div className="text-sm font-bold text-slate-800">弁護士ドットコム — 労働問題専門</div>
 <div className="text-xs text-slate-500 mt-0.5">初回相談無料 • 全国の弁護士を即日検索</div>
 </div>
 <span className="text-red-600 font-bold text-xs bg-red-500/10 border border-red-200 px-2 py-1 rounded-full">無料相談 →</span>
 </a>
 <a href="https://www.legal-mall.com/s/roudou" target="_blank" rel="noopener noreferrer sponsored"
 className="flex items-center justify-between bg-white/[0.05] border border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors">
 <div>
 <div className="text-sm font-bold text-slate-800">ベンナビ労働問題 — パワハラ・解雇</div>
 <div className="text-xs text-slate-500 mt-0.5">地域・得意分野で絞り込み • 弁護士費用の目安も確認</div>
 </div>
 <span className="text-red-600 font-bold text-xs bg-red-500/10 border border-red-200 px-2 py-1 rounded-full">弁護士を探す →</span>
 </a>
 </div>
 <p className="text-xs text-slate-400 text-center mt-3">※ 広告・PR掲載（各社公式サイトに遷移します）</p>
 </div>
 {/* 労務・メンタルケアアフィリエイト */}
 <div className="bg-green-500/10 border border-green-200 rounded-xl p-5">
 <p className="text-sm font-black text-green-800 mb-1">労務・給与管理を整えよう</p>
 <p className="text-xs text-green-700 mb-3">パワハラ解決後は労務・給与の正しい管理も大切。クラウド会計で経費・給与を一括管理しましょう。</p>
 <a
 href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+3LSINM+3SPO+9FDPYR"
 target="_blank"
 rel="noopener noreferrer sponsored"
 className="flex items-center justify-between bg-white/[0.05] border border-green-300 rounded-xl px-4 py-3 hover:bg-green-500/10 transition-colors mb-2"
 >
 <div>
 <div className="text-sm font-bold text-slate-800">freee会計 — 給与・経費をまとめて管理</div>
 <div className="text-xs text-slate-500 mt-0.5">中小企業・フリーランス向け • 初月無料で試せる</div>
 </div>
 <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">無料で試す →</span>
 </a>
 <p className="text-xs text-slate-400 text-center mt-1 mb-3">※ 広告・PR掲載（公式サイトに遷移します）</p>
 <p className="text-sm font-black text-blue-300 mb-1">ストレス発散にオンラインヨガ</p>
 <p className="text-xs text-blue-400 mb-3">職場ストレスが続くときは、体を動かすことが心の回復に効果的。自宅でいつでも参加できるヨガで気持ちをリセット。</p>
 <a
 href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
 target="_blank"
 rel="noopener noreferrer sponsored"
 className="flex items-center justify-between bg-white/[0.05] border border-blue-300 rounded-xl px-4 py-3 hover:bg-blue-500/10 transition-colors"
 >
 <div>
 <div className="text-sm font-bold text-slate-800">SOELU — オンラインヨガ・フィットネス</div>
 <div className="text-xs text-slate-500 mt-0.5">自宅でライブレッスン参加 • 初回30日間無料</div>
 </div>
 <span className="text-blue-400 font-bold text-xs bg-blue-100 px-2 py-1 rounded-full">無料で始める →</span>
 </a>
 <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載（公式サイトに遷移します）</p>
 {/* FPカフェアフィリエイト（A8.net）*/}
 <div className="mt-4 bg-blue-500/10 border border-blue-200 rounded-xl p-4">
 <p className="text-sm font-black text-blue-300 mb-1">弁護士費用のご相談（PR）</p>
 <p className="text-xs text-blue-400 mb-3">パワハラ・労働問題の弁護士費用や法的費用について、FPに無料相談できます。</p>
 <a
 href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+2SMA0I+5ULO+5YZ75"
 target="_blank"
 rel="noopener noreferrer sponsored"
 className="flex items-center justify-between bg-white/[0.05] border border-blue-300 rounded-xl px-4 py-3 hover:bg-blue-500/10 transition-colors"
 >
 <div>
 <div className="text-sm font-bold text-slate-800">FPカフェ — お金の専門家に無料相談</div>
 <div className="text-xs text-slate-500 mt-0.5">弁護士費用・資金繰りを専門家がサポート • 全国対応</div>
 </div>
 <span className="text-blue-400 font-bold text-xs bg-blue-100 px-2 py-1 rounded-full">無料相談 →</span>
 </a>
 <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載（公式サイトに遷移します）</p>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ストリーク表示 */}
 {streakData && streakData.count >= 2 && (
 <div className="mt-6 bg-amber-500/10 border border-amber-300 rounded-xl px-5 py-4 flex items-center gap-4">
 <div className="text-3xl font-black text-amber-400">{streakData.count}</div>
 <div>
 <p className="text-sm font-bold text-amber-800">日連続で診断中！</p>
 <p className="text-xs text-amber-400">最長記録: {streakData.longestStreak}日 / 累計: {streakData.totalDays}日</p>
 </div>
 {streakMilestone && (
 <span className="ml-auto text-xs font-bold bg-amber-400 text-white px-3 py-1 rounded-full">{streakMilestone}</span>
 )}
 </div>
 )}

 {/* 診断履歴パネル */}
 {diagnosisHistory.length > 0 && (
 <div className="mt-6 backdrop-blur-sm bg-white/90 border border-white/15 rounded-xl p-5">
 <h3 className="text-sm font-bold text-white/80 mb-3">過去の診断履歴（直近{diagnosisHistory.length}件）</h3>
 <ul className="space-y-2">
 {diagnosisHistory.map((h, i) => (
 <li key={i} className="flex items-start gap-3 text-sm text-white/60 border-b border-white/10 pb-2 last:border-0 last:pb-0">
 <span className="shrink-0 text-xs font-bold bg-white/5 text-white/50 px-2 py-0.5 rounded-full mt-0.5">{i + 1}</span>
 <div className="flex-1 min-w-0">
 <p className="truncate text-sm text-white/90">{h.text}{h.text.length >= 50 ? "…" : ""}</p>
 <p className="text-xs text-white/40 mt-0.5">{h.date}</p>
 </div>
 </li>
 ))}
 </ul>
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
 <h2 className="text-2xl font-bold text-center text-white mb-10">利用者の声</h2>
 <div className="grid md:grid-cols-3 gap-6">
 {VOICES.map((v) => (
 <div key={v.role} className="backdrop-blur-sm bg-white/90 rounded-xl p-6 border border-white/10">
 <p className="text-sm text-white/80 mb-4">「{v.text}」</p>
 <p className="text-xs text-white/40">{v.role}</p>
 </div>
 ))}
 </div>
 <p className="text-xs text-white/40 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
 </section>

 {/* IT導入補助金訴求 */}
 <section className="py-8 px-6">
   <div className="max-w-3xl mx-auto">
     <div className="bg-green-50 border border-green-200 rounded-2xl p-8 my-8">
       <div className="text-center mb-4">
         <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">補助金活用で費用削減</span>
         <h2 className="text-xl font-bold text-green-900">IT導入補助金2026で実質負担を大幅削減</h2>
       </div>
       <div className="grid md:grid-cols-3 gap-4 text-center">
         <div className="bg-white border border-green-100 rounded-xl p-4">
           <p className="text-xs text-green-600 font-semibold mb-1">通常料金</p>
           <p className="text-lg font-bold text-gray-800">¥2,980<span className="text-sm font-normal text-gray-500">/月</span></p>
           <p className="text-xs text-gray-500">× 12ヶ月 = ¥35,760/年</p>
         </div>
         <div className="flex items-center justify-center text-2xl font-bold text-green-600">→</div>
         <div className="bg-green-100 border border-green-300 rounded-xl p-4">
           <p className="text-xs text-green-700 font-semibold mb-1">補助率4/5適用後</p>
           <p className="text-2xl font-black text-green-700">¥7,152<span className="text-sm font-normal">/年</span></p>
           <p className="text-xs text-green-600 font-bold">約¥28,608 お得</p>
         </div>
       </div>
       <p className="text-xs text-green-700 text-center mt-4">※補助金申請は事業者様ご自身での手続きが必要です。詳細はIT導入補助金事務局のサイトをご確認ください。</p>
     </div>
   </div>
 </section>

 {/* Pricing */}
 <section className="bg-red-500/10 py-16">
 <div className="max-w-3xl mx-auto px-6 text-center">
 <h2 className="text-2xl font-bold text-white mb-8">料金プラン</h2>
 <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-5 mb-6">
 <p className="text-sm text-amber-400 font-bold mb-3 text-center">弁護士費用シミュレーター — あなたが節約できる金額</p>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
 {[
 { item: "初回相談料", lawyer: "¥5,000〜10,000", ai: "無料", saving: "最大¥10,000節約" },
 { item: "内容証明作成", lawyer: "¥30,000〜50,000", ai: "無料〜¥980/月", saving: "最大¥50,000節約" },
 { item: "労基署申告書", lawyer: "¥20,000〜", ai: "無料〜¥2,980/月", saving: "最大¥20,000節約" },
 { item: "着手金（訴訟）", lawyer: "¥300,000〜", ai: "書類準備のみ", saving: "準備コスト削減" },
 ].map((row) => (
 <div key={row.item} className="bg-white border border-amber-200 rounded-xl p-3 text-center">
 <p className="text-xs font-bold text-white/80 mb-1">{row.item}</p>
 <p className="text-xs text-white/40 line-through mb-0.5">{row.lawyer}</p>
 <p className="text-sm font-black text-amber-400">{row.ai}</p>
 <p className="text-xs text-green-600 font-bold mt-1">{row.saving}</p>
 </div>
 ))}
 </div>
 <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 text-center">
 <p className="text-amber-800 font-black text-lg">最大 ¥300,000 以上の節約</p>
 <p className="text-xs text-amber-400 mt-0.5">弁護士に依頼する前にAIで準備 → 弁護士費用を大幅に圧縮できます</p>
 </div>
 </div>
 <div className="grid md:grid-cols-3 gap-5">
 <div className="backdrop-blur-sm bg-white/90 rounded-2xl p-6 border border-white/15">
 <div className="text-lg font-bold text-white mb-2">無料プラン</div>
 <div className="text-3xl font-bold text-white mb-4">¥0</div>
 <ul className="text-sm text-white/60 space-y-2 mb-6 text-left">
 <li>3回まで無料で利用可能</li>
 <li>全5タブの書類生成</li>
 <li>コピー機能</li>
 </ul>
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="無料プランで診断ツールへスクロールして試す"
 className="w-full border border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-500/10 transition-colors"
 >
 無料で試す
 </button>
 </div>
 <div className="backdrop-blur-sm bg-white/90 rounded-2xl p-6 border border-red-300">
 <div className="text-lg font-bold text-white mb-2">ライトプラン</div>
 <div className="text-3xl font-bold text-red-600 mb-4">¥980<span className="text-lg font-normal text-white/50">/月</span></div>
 <ul className="text-sm text-white/60 space-y-2 mb-6 text-left">
 <li>法的評価（パワハラ該当判定）</li>
 <li>証拠収集ガイドライン</li>
 <li>月3回まで</li>
 <li className="text-white/40 text-xs">— 内容証明・申告書はなし</li>
 </ul>
 <button
 onClick={() => startCheckout("light")}
 aria-label="ライトプラン（¥980/月）の登録を開始する"
 className="w-full border border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-500/10 transition-colors"
 >
 ライトプランで始める
 </button>
 </div>
 <div className="bg-red-500 rounded-2xl p-6 text-white relative">
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">おすすめ</div>
 <div className="text-lg font-bold mb-2">スタンダードプラン</div>
 <div className="text-3xl font-bold mb-4">¥2,980<span className="text-lg font-normal">/月</span></div>
 <ul className="text-sm space-y-2 mb-6 text-left">
 <li>全機能利用可能</li>
 <li>内容証明・申告書ドラフト</li>
 <li>選択肢マップ</li>
 <li>無制限利用</li>
 <li>いつでも解約可能</li>
 </ul>
 <button
 onClick={() => startCheckout("standard")}
 aria-label="スタンダードプラン（¥2,980/月）にアップグレードして全機能を無制限で使う"
 className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-500/10 transition-colors"
 >
 スタンダードにアップグレード
 </button>
 </div>
 </div>
 <p className="text-xs text-white/40 mt-6">※ 弁護士費用の相場: 着手金30〜100万円 / 本サービスは法的助言ではありません</p>

 <div className="bg-gray-800 rounded-lg p-6 mt-8 border border-gray-700">
 <h3 className="text-white font-bold text-lg">重大なパワハラは専門家に相談</h3>
 <p className="text-white/40 mt-2 text-sm">解雇・大幅減給・継続的ハラスメントは法的手続きが有効です</p>
 <div className="grid grid-cols-2 gap-3 mt-4">
 <a href="https://www.bengo4.com/c_1076/" target="_blank" rel="noopener noreferrer"
 aria-label="弁護士ドットコムで労働問題の無料相談を申し込む（外部サイト）"
 className="bg-green-700 text-white text-center py-3 px-4 rounded-lg text-sm font-bold hover:bg-green-600">
 弁護士ドットコム<br/><span className="text-xs font-normal">無料相談受付中</span>
 </a>
 <a href="https://roudou-pro.com/" target="_blank" rel="noopener noreferrer"
 aria-label="ベンナビ労働問題で近くの弁護士を探す（外部サイト）"
 className="bg-blue-700 text-white text-center py-3 px-4 rounded-lg text-sm font-bold hover:bg-blue-500">
 ベンナビ労働問題<br/><span className="text-xs font-normal">近くの弁護士を探す</span>
 </a>
 </div>
 </div>
 </div>
 </section>

 {/* 解決実績・成功事例セクション */}
 <section className="py-14 bg-white border-b border-white/10">
 <div className="max-w-4xl mx-auto px-6">
 <div className="text-center mb-10">
 <div className="inline-block bg-green-500/10 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-green-200">実際の解決事例</div>
 <h2 className="text-2xl font-bold text-white">パワハラ対策AIで解決した事例</h2>
 <p className="text-white/50 text-sm mt-2">同じ悩みを持つ方が、自分で書類を作成して解決に至った事例です</p>
 </div>
 <div className="grid md:grid-cols-3 gap-6">
 {[
 {
 icon: "money",
 badge: "未払い残業代 回収",
 badgeColor: "bg-green-100 text-green-700 border-green-200",
 title: "3年分の未払い残業代を回収",
 person: "30代・会社員（製造業）",
 detail: "月30〜50時間のサービス残業が3年間続いていました。本サービスで申告書ドラフトを作成し、労基署に持参。会社から合計82万円の支払いを受けました。",
 result: "回収額：82万円",
 resultColor: "text-green-700",
 duration: "解決まで：約2ヶ月",
 },
 {
 icon: "building",
 badge: "解雇撤回",
 badgeColor: "bg-blue-100 text-blue-400 border-blue-200",
 title: "不当解雇の通知を撤回させた",
 person: "40代・営業職（IT系）",
 detail: "突然「能力不足」を理由に解雇通知を受け取りました。内容証明文と法的評価レポートを弁護士に見せたところ、会社側が撤回。職場に復帰しました。",
 result: "解雇撤回・職場復帰",
 resultColor: "text-blue-400",
 duration: "解決まで：約3週間",
 },
 {
 icon: "shield",
 badge: "パワハラ行為 停止",
 badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
 title: "毎日の罵倒・怒鳴りが止まった",
 person: "20代・一般職（小売業）",
 detail: "上司から「クビにするぞ」と毎日脅されていました。内容証明を人事部宛に送付したところ、1週間でハラスメント行為が完全に停止。転勤対応もしてもらえました。",
 result: "ハラスメント停止・転勤措置",
 resultColor: "text-purple-700",
 duration: "解決まで：約1週間",
 },
 ].map((c, i) => (
 <div key={i} className="backdrop-blur-sm bg-white/90 border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
 <div className="flex items-start gap-3">
 <SvgI name={c.icon} className="w-8 h-8" />
 <div>
 <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>{c.badge}</span>
 <h3 className="font-bold text-white mt-2 text-sm leading-tight">{c.title}</h3>
 <p className="text-xs text-white/40 mt-1">{c.person}</p>
 </div>
 </div>
 <p className="text-xs text-white/60 leading-relaxed flex-1">{c.detail}</p>
 <div className="backdrop-blur-sm bg-white/90 border border-white/15 rounded-xl p-3">
 <p className={`font-black text-sm ${c.resultColor}`}>{c.result}</p>
 <p className="text-xs text-white/40 mt-0.5">{c.duration}</p>
 </div>
 </div>
 ))}
 </div>
 <p className="text-center text-xs text-white/40 mt-6">※ 事例は個人の体験談であり、すべての案件で同様の結果が得られることを保証するものではありません。</p>
 <div className="mt-6 text-center">
 <button
 onClick={() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" })}
 aria-label="解決事例を参考に自分のパワハラ対策書類を今すぐ無料3回作成する"
 className="inline-block bg-red-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-400 transition-colors"
 >
 自分の書類を今すぐ作成する（無料3回）→
 </button>
 </div>
 </div>
 </section>

 {/* Cross-sell: クレームAI */}
 <section className="max-w-4xl mx-auto px-6 py-8">
 <div className="bg-orange-500/10 border border-orange-200 rounded-2xl p-6 flex items-center gap-5">
 <div className="text-4xl shrink-0"></div>
 <div className="flex-1">
 <p className="text-xs font-semibold text-orange-500 mb-1">一緒に使うと効果的</p>
 <h3 className="font-bold text-white mb-1">クレームAI との併用で外部クレームにも即対応</h3>
 <p className="text-sm text-white/60">社内ハラスメント対策 + 顧客・取引先からのカスタマーハラスメント対応をワンセットで。中小企業のCS・HR担当者に最適。</p>
 </div>
 <a
 href="https://claim-ai-beryl.vercel.app"
 target="_blank"
 rel="noopener noreferrer"
 className="shrink-0 bg-orange-500/100 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
 >
 詳細を見る →
 </a>
 </div>
 </section>

 {/* FAQ */}
 <section className="py-12 bg-white/[0.02]/5 px-6">
 <div className="max-w-2xl mx-auto">
 <h2 className="text-xl font-bold text-center text-white/90 mb-6">よくある質問</h2>
 <div className="space-y-3">
 {[
 { q: "どんなパワハラ事例に対応していますか？", a: "怒鳴り・無視・過大な業務・個人攻撃・SNS投稿など厚生労働省が定める6類型すべてに対応。証拠記録・社内相談・法的手続きまでサポートします。" },
 { q: "弁護士に相談するより何が良いですか？", a: "弁護士着手金の相場は¥30〜50万。本サービスは月額¥980から24時間いつでも対応策を生成できます。まず状況整理→必要なら弁護士紹介まで一貫してサポートします。" },
 { q: "証拠が残っていなくても使えますか？", a: "はい。証拠がない状態でも、今後の証拠収集方法・記録のつけ方・証人確保の手順をAIがアドバイスします。これから証拠を作るためのツールとしても活用できます。" },
 { q: "会社に知られずに使えますか？", a: "完全に匿名でご利用いただけます。入力した情報は会社・上司・人事部門には一切共有されません。" },
 { q: "パワハラ防止法（労働施策総合推進法）とは何ですか？", a: "2020年6月に施行された法律で、すべての企業にパワーハラスメント防止措置が義務付けられています。優越的な関係を背景とした、業務上必要な範囲を超えた言動が対象です。違反した場合は民法709条（不法行為）に基づく損害賠償請求が可能です。" },
 { q: "内容証明文は実際に使えますか？", a: "AIが生成する内容証明文はドラフト（参考文）です。送付前に内容を確認し、必要に応じて弁護士にレビューを依頼することをお勧めします。実際に内容証明を送ることで、会社側が対応を改善したケースは多数あります。" },
 { q: "補助金は使えますか？", a: "デジタル化・AI導入補助金2026の対象ツールとして申請中です。採択された場合、導入費用の一部を補助金で賄える可能性があります。詳細は最新の補助金情報をご確認ください。" },
 { q: "2026年10月の義務化に対応できますか？", a: "改正労働施策総合推進法が求めるパワハラ対策の書類作成・記録保管をサポートします。対応記録の自動生成・証拠タイムラインの保存機能により、義務化後の社内記録管理にも活用いただけます。" },
 ].map((faq, i) => (
 <details key={i} className="backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-xl shadow-lg group">
 <summary className="px-5 py-4 font-semibold text-white/90 text-sm cursor-pointer flex justify-between items-center hover:bg-white/5 rounded-xl list-none">
 <span>Q. {faq.q}</span>
 <span className="text-red-500 text-lg ml-2 group-open:rotate-45 transition-transform">+</span>
 </summary>
 <div className="px-5 pb-4 text-sm text-white/60 border-t border-white/10 pt-3">A. {faq.a}</div>
 </details>
 ))}
 </div>
 </div>
 </section>

 {/* パワハラAIだけができること — 差別化SEOセクション */}
 <section className="bg-indigo-500/10 border-t border-indigo-100 py-14 px-6">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-indigo-100 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mb-3">他にない機能</div>
 <h2 className="text-2xl font-bold text-white mb-2">パワハラAIが弁護士・労組より先に使われる3つの理由</h2>
 <p className="text-sm text-white/50">「弁護士に行く前に状況を整理したい」という方に特に選ばれています</p>
 </div>
 <div className="grid md:grid-cols-3 gap-5 mb-8">
 {[
 {
 icon: "scale",
 title: "法的根拠を5つ同時出力",
 desc: "パワハラ防止法第30条の2・民法709条・会社の安全配慮義務（労働契約法5条）など、複数の法条文を評価レポートに自動付加。「どの法律が使えるか」を即整理できます。",
 badge: "弁護士費用0円",
 },
 {
 icon: "clipboard",
 title: "5種類の文書を同時生成",
 desc: "法的評価・証拠収集GL・内容証明文・労基署申告書・選択肢マップを1回の入力で全部生成。バラバラに頼む手間がゼロで、今すぐ行動に移せます。",
 badge: "1回の入力で完了",
 },
 {
 icon: "shield",
 title: "証拠タイムラインで可視化",
 desc: "時系列でパワハラ行為を記録できる証拠タイムラインUI。労基署・弁護士への相談時に「いつ・何が・どこで」を整理して持参できます。",
 badge: "証拠力を高める",
 },
 ].map(item => (
 <div key={item.title} className="backdrop-blur-sm bg-white/90 rounded-2xl p-5 border border-indigo-100 shadow-lg">
 <div className="flex items-center gap-2 mb-3">
 <SvgI name={item.icon} className="w-7 h-7" />
 <span className="text-xs bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
 </div>
 <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
 <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
 </div>
 ))}
 </div>
 <div className="backdrop-blur-sm bg-white/90 border border-indigo-200 rounded-2xl p-5 max-w-2xl mx-auto">
 <p className="text-xs font-bold text-indigo-400 mb-3 text-center">パワハラAI vs 法的手段 — コスト・速度比較</p>
 <div className="grid grid-cols-4 text-xs text-center gap-1">
 <div className="font-bold text-white/50 text-left text-xs">手段</div>
 <div className="font-bold text-indigo-400 text-xs">パワハラAI</div>
 <div className="font-bold text-white/50 text-xs">弁護士</div>
 <div className="font-bold text-white/50 text-xs">労基署</div>
 {[
 ["費用", "無料〜¥980/月", "着手金¥30〜50万", "0円"],
 ["スピード", "即日（15秒）", "数日〜数週間", "1〜6ヶ月"],
 ["法的根拠", "自動付加", "提示あり", "対応あり"],
 ["匿名で可能", "", "", ""],
 ].map(([label, ai, lawyer, govt]) => (
 <>
 <div key={label} className="text-left text-white/60 py-1.5 border-t border-white/10 text-xs">{label}</div>
 <div className="text-indigo-400 font-bold py-1.5 border-t border-white/10">{ai}</div>
 <div className="text-white/40 py-1.5 border-t border-white/10">{lawyer}</div>
 <div className="text-white/40 py-1.5 border-t border-white/10">{govt}</div>
 </>
 ))}
 </div>
 </div>
 <div className="text-center mt-6">
 <Link href="/tool" className="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 text-sm shadow-xl">
 今すぐ無料で状況を整理する →
 </Link>
 </div>
 </div>
 </section>

 {/* シェアセクション */}
 <section className="py-8 px-6 text-center border-t border-white/10">
 <p className="text-sm text-white/50 mb-4">パワハラで困っている知人に教えてあげてください</p>
 <ShareButtons url="https://pawahara-ai.vercel.app" text="パワハラ対策AIを使ってみた！" hashtags="パワハラ対策AI" />
 </section>

 {/* Footer */}
 <CrossSell currentService="パワハラ対策AI" />

 <footer className="border-t border-white/10 py-8 px-6">
 <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
 <span>© 2026 パワハラ対策AI</span>
 <div className="flex gap-6">
 <Link href="/legal" className="hover:text-white/60">特定商取引法</Link>
 <Link href="/privacy" className="hover:text-white/60">プライバシーポリシー</Link>
 <Link href="/cancel" className="hover:text-white/60">解約・退会</Link>
 </div>
 </div>
 <div className="max-w-5xl mx-auto border-t border-white/10 pt-3 mt-4 text-xs text-center text-white/40">
 <p className="mb-1">ポッコリラボの他のサービス</p>
 <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
 <a href="https://claim-ai-beryl.vercel.app" className="hover:text-white/60">クレームAI</a>
 <a href="https://hojyokin-ai-delta.vercel.app" className="hover:text-white/60">補助金AI</a>
 <a href="https://keiyakusho-ai.vercel.app" className="hover:text-white/60">契約書AIレビュー</a>
 <a href="https://rougo-sim-ai.vercel.app" className="hover:text-white/60">老後シミュレーターAI</a>
 <a href="https://ai-keiei-keikaku.vercel.app" className="hover:text-white/60">AI経営計画書</a>
 </div>
 </div>
 </footer>
 <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "パワハラの証拠はどうやって集めればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "日時・場所・発言内容・証人を記録し、録音・スクリーンショット等を保存します。このAIは証拠収集の手順と対処法を即時提示します。"
          }
        },
        {
          "@type": "Question",
          "name": "パワハラを受けたとき最初にすべきことは？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "まず証拠を保全し、次に社内窓口・労働基準監督署・弁護士の3択を検討します。AIが状況に応じた具体的な対処法を提示します。"
          }
        },
        {
          "@type": "Question",
          "name": "弁護士に頼むと費用はいくらかかりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "労働問題の弁護士費用は着手金10〜30万円、成功報酬10〜20%が相場です。このAIなら弁護士費用の1/100以下でスクリプトと対処法を取得できます。"
          }
        }
      ]
    })
  }}
 />
 <AdBanner slot="" />
 </main>
 <ExitIntentPopup
   serviceUrl="https://pawahara-ai.vercel.app"
   message="パワハラの悩みを今すぐAIに相談できます。弁護士費用の1/100、最初の相談は無料です。"
   ctaText="無料で相談してみる"
 />
 </>
 );
}

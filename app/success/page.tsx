"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];
    const ps = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4">&#x1F6E1;&#xFE0F;</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">プレミアム会員へようこそ！</h1>
          <p className="text-gray-500">あなたの職場問題を解決するための全機能が使えます</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-red-800 mb-3 text-sm">あなたの特典</h2>
          <ul className="space-y-2 text-sm text-red-900">
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">&#10003;</span>
              法的評価・証拠収集ガイドが無制限
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">&#10003;</span>
              内容証明郵便の自動下書き生成
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">&#10003;</span>
              労基署申告書テンプレート自動作成
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">&#10003;</span>
              5タブ詳細分析で最適な解決策を提案
            </li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-gray-800 text-center text-sm">解決への3ステップ</h2>

          <Link href="/#tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-red-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-red-500">1</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">現在の状況を診断する</p>
              <p className="text-xs text-gray-400">状況を入力してAIが法的評価を実施</p>
            </div>
            <span className="text-gray-300 group-hover:text-red-600 transition-colors">&rarr;</span>
          </Link>

          <Link href="/#tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-red-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-red-500">2</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">証拠収集を始める</p>
              <p className="text-xs text-gray-400">AIが提案する証拠リストに沿って記録</p>
            </div>
            <span className="text-gray-300 group-hover:text-red-600 transition-colors">&rarr;</span>
          </Link>

          <Link href="/#tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-red-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-red-500">3</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">法的文書を作成する</p>
              <p className="text-xs text-gray-400">内容証明・申告書をAIが自動生成</p>
            </div>
            <span className="text-gray-300 group-hover:text-red-600 transition-colors">&rarr;</span>
          </Link>
        </div>

        <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-sm font-bold text-gray-700 mb-1">あなたは一人ではありません</p>
          <p className="text-xs text-gray-500">パワハラ問題の解決には時間がかかります。焦らず、一歩ずつ進めましょう。</p>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}

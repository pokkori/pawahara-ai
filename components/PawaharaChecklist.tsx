"use client";
import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "pawahara_checklist";

const PHASES = [
  {
    phase: 1,
    label: "Phase 1 — 記録",
    color: "red",
    items: [
      "パワハラの日時・場所・内容を記録した（メモ帳・日記）",
      "発言をそのままメモした（言葉通りに記録）",
      "第三者（同僚）が目撃していた",
      "メール・チャット・録音記録を保存した",
      "体調不良の場合、医療機関を受診し診断書を取得した",
    ],
  },
  {
    phase: 2,
    label: "Phase 2 — 相談",
    color: "orange",
    items: [
      "会社の相談窓口（ハラスメント窓口・人事）に相談した",
      "労働基準監督署に相談済み",
      "弁護士または法テラスに相談した（または予約済み）",
    ],
  },
  {
    phase: 3,
    label: "Phase 3 — 対策",
    color: "green",
    items: [
      "労働組合または社外のユニオンに加入を検討した",
      "必要に応じて労働審判・民事訴訟の手続きを確認した",
    ],
  },
];

const TOTAL = PHASES.reduce((sum, p) => sum + p.items.length, 0);

const COLOR_MAP: Record<string, { badge: string; bar: string; border: string; bg: string; check: string }> = {
  red:    { badge: "bg-red-100 text-red-700 border-red-200",    bar: "bg-red-500",    border: "border-red-200",   bg: "bg-red-50",    check: "accent-red-600" },
  orange: { badge: "bg-orange-100 text-orange-700 border-orange-200", bar: "bg-orange-500", border: "border-orange-200", bg: "bg-orange-50", check: "accent-orange-600" },
  green:  { badge: "bg-green-100 text-green-700 border-green-200",  bar: "bg-green-500",  border: "border-green-200",  bg: "bg-green-50",  check: "accent-green-600" },
};

export default function PawaharaChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const prevDoneRef = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setChecked(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  // 全項目完了時にモーダルを表示（初回だけ）
  useEffect(() => {
    if (prevDoneRef.current < TOTAL && doneCount === TOTAL) {
      setShowCompleteModal(true);
    }
    prevDoneRef.current = doneCount;
  }, [doneCount]);

  return (
    <>
    {showCompleteModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-xl text-center relative">
          <button
            onClick={() => setShowCompleteModal(false)}
            aria-label="モーダルを閉じる"
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div className="flex justify-center mb-3"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
          <h2 className="text-lg font-black text-gray-900 mb-2">証拠収集完了！</h2>
          <p className="text-sm text-gray-600 mb-5">
            全10項目クリアしました。<br />
            次は弁護士相談ステップへ進みましょう。
          </p>
          <div className="space-y-3">
            <a
              href="#tool"
              onClick={() => { setShowCompleteModal(false); document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" }); }}
              className="block w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors text-sm"
            >
              内容証明を作成する →
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("パワハラ対策AIの証拠収集チェックリスト全10項目クリアした！内容証明・証拠収集GL・申告書ドラフトがAIで作れる💪 同じ悩みの方に → https://pawahara-ai.vercel.app #パワハラ対策 #職場トラブル #ハラスメント対策")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Xでシェアして仲間を助ける
            </a>
            <a
              href="https://www.bengo4.com/c_5/"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block w-full border border-red-400 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              弁護士に無料相談する（弁護士ドットコム）→
            </a>
            <a
              href="https://www.legal-mall.com/s/roudou"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block w-full border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              ベンナビ労働問題で弁護士を探す →
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">※ 各リンクは広告・PR掲載です</p>
        </div>
      </div>
    )}
    <div className="mt-8 bg-white border border-red-200 rounded-2xl overflow-hidden">
      {/* Header (always visible) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`パワハラ証拠保全チェックリスト — ${doneCount}/${TOTAL}完了 — ${open ? "折りたたむ" : "開く"}`}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-xl">📋</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">パワハラ証拠保全チェックリスト</p>
            <p className="text-xs text-gray-500 mt-0.5">3フェーズ10項目 — 進捗が保存されます</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-sm font-bold text-red-700">{doneCount}/{TOTAL}</span>
          <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Progress bar */}
      <div className="px-6 pb-3">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{pct}% 完了</span>
          {doneCount === TOTAL && (
            <span className="text-green-600 font-bold animate-pulse">✅ 全項目クリア！</span>
          )}
        </div>
      </div>

      {/* Collapsible body */}
      {open && (
        <div className="px-6 pb-6 space-y-5 border-t border-red-100 pt-5">
          {PHASES.map((p) => {
            const c = COLOR_MAP[p.color];
            const phaseDone = p.items.filter((_, i) => checked[`${p.phase}-${i}`]).length;
            return (
              <div key={p.phase} className={`border ${c.border} rounded-xl p-4 ${c.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
                    {p.label}
                  </span>
                  <span className="text-xs text-gray-500">{phaseDone}/{p.items.length}</span>
                </div>
                <ul className="space-y-2">
                  {p.items.map((item, i) => {
                    const key = `${p.phase}-${i}`;
                    return (
                      <li key={key}>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={!!checked[key]}
                            onChange={() => toggle(key)}
                            className={`mt-0.5 h-4 w-4 rounded ${c.check} shrink-0`}
                          />
                          <span
                            className={`text-sm leading-relaxed transition-colors ${
                              checked[key] ? "line-through text-gray-400" : "text-gray-700 group-hover:text-gray-900"
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {doneCount === TOTAL && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center">
              <p className="text-green-700 font-bold text-sm">🎉 全10項目クリア！</p>
              <p className="text-xs text-green-600 mt-1">十分な証拠保全が完了しています。弁護士・労基署への相談に進みましょう。</p>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            ※ チェック状態はブラウザに保存されます。プライベートモードでは保存されません。
          </p>
        </div>
      )}
    </div>
    </>
  );
}

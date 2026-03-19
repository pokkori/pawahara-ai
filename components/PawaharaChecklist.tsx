"use client";
import { useState, useEffect } from "react";

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

  return (
    <div className="mt-8 bg-white border border-red-200 rounded-2xl overflow-hidden">
      {/* Header (always visible) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
  );
}

"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "pawahara_timeline";

type EvidenceType = "録音" | "メール" | "メモ" | "目撃者" | "診断書" | "写真" | "その他";

interface TimelineEntry {
  id: string;
  date: string;
  time: string;
  content: string;
  location: string;
  evidenceType: EvidenceType;
  severity: 1 | 2 | 3;
  createdAt: number;
}

const EVIDENCE_TYPES: EvidenceType[] = ["録音", "メール", "メモ", "目撃者", "診断書", "写真", "その他"];

const SEVERITY_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "軽", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  2: { label: "中", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  3: { label: "重", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const CONTENT_PRESETS = [
  "上司から怒鳴られた・罵倒された",
  "業務外の作業を強要された",
  "他の社員の前で侮辱された",
  "LINEやメールで暴言を受けた",
  "不当な降格・業務外しをされた",
  "長時間残業を強要された",
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadEntries(): TimelineEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as TimelineEntry[];
  } catch {}
  return [];
}

function saveEntries(entries: TimelineEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

function formatDateJP(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y}年${m}月${d}日`;
}

export default function EvidenceTimeline() {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [form, setForm] = useState<Omit<TimelineEntry, "id" | "createdAt">>({
    date: new Date().toISOString().slice(0, 10),
    time: "",
    content: "",
    location: "",
    evidenceType: "メモ",
    severity: 2,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const handleAddPreset = (preset: string) => {
    setForm((f) => ({ ...f, content: f.content ? f.content + "。" + preset : preset }));
  };

  const handleSubmit = () => {
    if (!form.date || !form.content.trim()) return;
    const entry: TimelineEntry = {
      ...form,
      id: generateId(),
      createdAt: Date.now(),
    };
    const next = [entry, ...entries].sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
      const db = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      return db - da;
    });
    setEntries(next);
    saveEntries(next);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      time: "",
      content: "",
      location: "",
      evidenceType: "メモ",
      severity: 2,
    });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  const handleExport = () => {
    if (!entries.length) return;
    const lines = [
      "【パワハラ証拠タイムライン — エクスポート】",
      `出力日時: ${new Date().toLocaleString("ja-JP")}`,
      `記録件数: ${entries.length}件`,
      "─".repeat(40),
      ...entries.map((e, i) => [
        `【記録 ${i + 1}】`,
        `日時: ${formatDateJP(e.date)}${e.time ? " " + e.time : ""}`,
        `場所: ${e.location || "未記入"}`,
        `証拠種別: ${e.evidenceType}`,
        `深刻度: ${SEVERITY_LABELS[e.severity].label}`,
        `内容: ${e.content}`,
        "─".repeat(30),
      ].join("\n")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `パワハラ証拠記録_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 bg-white border border-blue-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`証拠記録タイムライン — ${entries.length}件 — ${open ? "折りたたむ" : "開く"}`}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 2v4M13 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div>
            <p className="font-bold text-gray-900 text-sm">証拠記録タイムライン</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {entries.length > 0 ? `${entries.length}件の記録 — ブラウザに保存済み` : "日時・内容・証拠種別を記録して保存"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {entries.length > 0 && (
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              {entries.length}件
            </span>
          )}
          <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-blue-100 px-6 pb-6 pt-5 space-y-4">
          {/* 追加ボタン */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {entries.length === 0
                ? "パワハラが起きるたびに記録しましょう。裁判・労基署申告の証拠になります。"
                : `${entries.length}件の記録。記録が増えるほど立証力が上がります。`}
            </p>
            <div className="flex items-center gap-2">
              {entries.length > 0 && (
                <button
                  onClick={handleExport}
                  aria-label="証拠記録をテキストファイルとして出力"
                  className="text-xs text-blue-600 border border-blue-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
                >
                  テキスト出力
                </button>
              )}
              <button
                onClick={() => setShowForm((f) => !f)}
                aria-label={showForm ? "記録追加フォームを閉じる" : "新しい証拠記録を追加する"}
                aria-expanded={showForm}
                className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700 transition-colors font-bold"
              >
                {showForm ? "閉じる" : "+ 記録を追加"}
              </button>
            </div>
          </div>

          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700 font-bold">
              記録を保存しました
            </div>
          )}

          {/* 入力フォーム */}
          {showForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
              <p className="text-xs font-bold text-blue-700 mb-2">新しい記録を追加</p>

              {/* 日付・時刻 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">日付 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">時刻（任意）</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* 場所 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">場所（任意）</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="例: 部長室・会議室A・Slack上"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* 内容プリセット */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">内容（タップで追加）</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {CONTENT_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleAddPreset(p)}
                      className="text-xs bg-white border border-blue-300 text-blue-700 rounded-full px-2.5 py-1 hover:bg-blue-100 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="例: 部長から「お前は使えない」と全員の前で怒鳴られた。録音あり。"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* 証拠種別 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">証拠種別</label>
                <div className="flex flex-wrap gap-2">
                  {EVIDENCE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, evidenceType: t }))}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        form.evidenceType === t
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 深刻度 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">深刻度</label>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, severity: s }))}
                      className={`flex-1 text-xs py-2 rounded-lg border transition-colors font-bold ${
                        form.severity === s
                          ? `${SEVERITY_LABELS[s].bg} ${SEVERITY_LABELS[s].color} border-current`
                          : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {["", "軽微", "中程度", "深刻"][s]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!form.date || !form.content.trim()}
                aria-label="証拠記録を保存する"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                記録を保存する
              </button>
            </div>
          )}

          {/* タイムライン一覧 */}
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => {
                const sv = SEVERITY_LABELS[entry.severity];
                return (
                  <div key={entry.id} className={`border rounded-xl p-4 ${sv.bg}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-xs font-bold text-gray-700">
                            {formatDateJP(entry.date)}{entry.time ? ` ${entry.time}` : ""}
                          </span>
                          {entry.location && (
                            <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                              {entry.location}
                            </span>
                          )}
                          <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                            {entry.evidenceType}
                          </span>
                          <span className={`text-xs font-bold rounded-full px-2 py-0.5 border ${sv.bg} ${sv.color}`}>
                            深刻度:{sv.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed break-words">{entry.content}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        aria-label={`${formatDateJP(entry.date)}の記録を削除`}
                        className="shrink-0 text-xs text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                        title="削除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            !showForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">まだ記録がありません</p>
                <p className="text-xs text-gray-400">「+ 記録を追加」から日時・内容を記録しましょう</p>
              </div>
            )
          )}

          <p className="text-xs text-gray-400 text-center">
            ※ 記録はこのブラウザのみに保存されます。プライベートモードでは保存されません。
          </p>
        </div>
      )}
    </div>
  );
}

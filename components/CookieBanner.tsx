"use client";
import { useState, useEffect } from "react";
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-300">当サービスはGoogle Analytics等の外部サービスを利用しています。<a href="/privacy" className="underline text-blue-400 ml-1">プライバシーポリシー</a></p>
      <button onClick={() => { localStorage.setItem("cookie_consent","1"); setShow(false); }} className="shrink-0 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">同意する</button>
    </div>
  );
}

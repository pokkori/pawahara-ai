export const metadata = {
  title: "解約・退会 | パワハラ対策AI",
  description: "パワハラ対策AIの解約・退会手続きページです。",
};

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">解約・退会</h1>

        <div className="space-y-4 text-sm text-gray-300 mb-8">
          <p>ご利用いただきありがとうございます。解約をご希望の場合は、以下の方法で手続きいただけます。</p>

          <div className="bg-white/5 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">解約方法</h2>
            <p>以下のメールアドレスに「解約希望」とご連絡ください。24時間以内に解約処理を行います。</p>
            <a
              href="mailto:support@levona.design?subject=%E8%A7%A3%E7%B4%84%E5%B8%8C%E6%9C%9B%EF%BC%9A%E3%83%91%E3%83%AF%E3%83%8F%E3%83%A9%E5%AF%BE%E7%AD%96AI"
              className="inline-block mt-3 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors min-h-[44px]"
              aria-label="解約メールを送信"
            >
              解約を申請する
            </a>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">解約後について</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>解約後は次回決済日から課金が停止されます</li>
              <li>解約日までのサービスは引き続きご利用いただけます</li>
              <li>デジタルコンテンツの性質上、既に支払い済みの料金の返金はいたしかねます</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">お問い合わせ</h2>
            <p>ご不明点がございましたら、お気軽にご連絡ください。</p>
            <p className="mt-1">メール: support@levona.design</p>
          </div>
        </div>

        <a href="/" className="block text-center text-gray-400 hover:text-white transition-colors" aria-label="トップページに戻る">
          ← トップページに戻る
        </a>
      </div>
    </div>
  );
}

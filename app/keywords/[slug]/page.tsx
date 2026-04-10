import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossSell } from "@/components/CrossSell";

interface KeywordData {
  title: string;
  h1: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
  lastUpdated: string;
}

const KEYWORDS: Record<string, KeywordData> = {
  "pawahara-hanrei-jirei": {
    title: "パワハラ 判例 事例｜具体的な認定基準をAIが解説",
    h1: "パワハラ 判例 事例",
    description: "パワハラの判例・事例をAIが解説。裁判で認定されたパワハラの特徴・証拠の集め方・対処法を30秒でわかりやすく提示。登録不要。",
    features: [
      { icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3", title: "判例ベースの解説", text: "実際の裁判で認定されたパワハラ事例を基に、あなたの状況がパワハラに該当するか判断する基準をAIが解説します。" },
      { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "証拠収集ガイド", text: "証拠として有効なもの（メール・録音・日記・医師の診断書）の収集方法を具体的に案内します。" },
      { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "相談窓口への連携", text: "労働局・社内相談窓口・弁護士への相談手順を段階的に案内。一人で抱え込まない対処法を提示。" },
    ],
    faqs: [
      { q: "パワハラと厳しい指導の違いは何ですか？", a: "業務上の必要性・相当性・人格否定の有無が判断基準です。同じ行為でも繰り返し・全員の前での叱責・人格攻撃があるとパワハラになります。パワハラ対策AIが状況を踏まえた判断を支援します。" },
      { q: "パワハラの証拠にはどんなものが有効ですか？", a: "ボイスレコーダーの録音・メール・SNSメッセージ・日記（日時・内容・証人）・医師の診断書が有効です。パワハラ対策AIで証拠収集のチェックリストを生成できます。" },
      { q: "会社の相談窓口に言うと報復されませんか？", a: "労働施策総合推進法により、ハラスメント相談を理由とした不利益取扱いは禁止されています。社内窓口が機能しない場合は都道府県労働局への申告も可能です。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "pawahara-soudan-madoguchi": {
    title: "パワハラ 相談 窓口｜無料で相談できる機関をAIが案内",
    h1: "パワハラ 相談 窓口",
    description: "パワハラの無料相談窓口をAIが案内。労働局・弁護士・社労士への相談手順と準備すべき証拠を30秒でわかりやすく提示。",
    features: [
      { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "相談先を自動マッチング", text: "状況・重さ・緊急度に応じて最適な相談先（会社の相談窓口→労働局→弁護士）を案内します。" },
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "相談前の準備を支援", text: "相談窓口に伝えるべき内容・持参する証拠・状況の整理をAIがサポート。初回相談を有効に活用できます。" },
      { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "無料相談の活用法", text: "法テラス・弁護士会・労働局の無料法律相談を最大活用するためのポイントを案内します。" },
    ],
    faqs: [
      { q: "パワハラを無料で相談できる機関はどこですか？", a: "都道府県労働局（総合労働相談コーナー）、法テラス（法的トラブル無料相談）、弁護士会の法律相談（30分無料）があります。パワハラ対策AIで状況に合った相談先を案内します。" },
      { q: "労働局に相談するとどうなりますか？", a: "あっせん（話し合いの仲介）または労働審判・訴訟の案内を受けられます。会社への調査・指導も可能です。パワハラ対策AIで相談前の準備ができます。" },
      { q: "弁護士に相談するタイミングはいつがいいですか？", a: "証拠が揃い、社内解決が難しいと判断した時点が目安です。労働事件専門の弁護士への相談を推奨します。パワハラ対策AIで弁護士相談前の状況整理ができます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "pawahara-kiroku-houkokusho": {
    title: "パワハラ 記録 報告書 書き方｜証拠になる日記をAIが自動生成",
    h1: "パワハラ 記録 報告書 書き方",
    description: "パワハラの証拠になる記録・報告書の書き方をAIが支援。法的証拠として有効な日時・内容・証人を含む記録を30秒で作成。",
    features: [
      { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", title: "法的証拠として有効な記録", text: "日時・場所・発言内容・証人・心身への影響を含む証拠価値の高い記録フォームをAIが生成。弁護士・労働局への提出にも使えます。" },
      { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "時系列で整理", text: "複数回のパワハラ被害を時系列で整理し、パターン・頻度・エスカレーションの証明に役立てます。" },
      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "報告書テンプレートを生成", text: "会社の相談窓口・人事部・労働局への提出に使える正式な報告書テンプレートを自動生成します。" },
    ],
    faqs: [
      { q: "パワハラの記録として有効なものは何ですか？", a: "「日時・場所・内容・証人・心身への影響」を記録した日記、メール・チャットのスクリーンショット、録音データが有効です。パワハラ対策AIで証拠価値の高い記録フォームを生成できます。" },
      { q: "録音はパワハラの証拠になりますか？", a: "自分が会話に参加している場での録音は合法です（盗聴罪にはあたりません）。スマートフォンのボイスメモで記録しましょう。証拠として裁判でも使用できます。" },
      { q: "記録を会社に提出すると報復されますか？", a: "労働施策総合推進法により、ハラスメント相談・証拠提出を理由とした不利益取扱いは禁止されています。記録の提出先・タイミングはパワハラ対策AIが状況に応じて案内します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "pawahara-taisyoku-shorei": {
    title: "パワハラ 退職 勧奨 断り方｜違法な退職強要への対処法",
    h1: "パワハラ 退職 勧奨 断り方",
    description: "違法な退職勧奨・パワハラによる退職強要の断り方をAIが解説。証拠の取り方・法的対処法・賠償請求まで30秒で案内。",
    features: [
      { icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", title: "違法な退職勧奨の見分け方", text: "適法な退職勧奨と違法な退職強要（意思に反する繰り返し・脅迫・監禁）の違いを明確に解説します。" },
      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "断り方のスクリプト", text: "退職勧奨を明確に断る文言・証拠保全の方法・断った後の行動を具体的にガイドします。" },
      { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "損害賠償請求の可能性", text: "違法な退職強要・パワハラによる損害賠償請求の要件・金額相場・手続きを解説します。" },
    ],
    faqs: [
      { q: "退職勧奨と退職強要の違いは何ですか？", a: "退職勧奨は合法（会社が退職を打診すること）、退職強要は違法（意思に反して繰り返し迫る・脅迫・監禁を伴うもの）です。パワハラ対策AIで状況が違法に当たるか判断を支援します。" },
      { q: "退職勧奨を断ったら解雇されますか？", a: "退職勧奨を断っても即解雇はできません。解雇するには客観的に合理的な理由が必要です（労働契約法16条）。パワハラ対策AIで断り方と対応手順を案内します。" },
      { q: "パワハラで会社を辞めた場合、損害賠償を請求できますか？", a: "パワハラによる精神的苦痛・転職費用・逸失利益の賠償を請求できる可能性があります。証拠の有無・被害の程度によって変わります。パワハラ対策AIで証拠収集方法を案内します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "power-harassment-teigi": {
    title: "パワハラ 定義 6種類｜厚生労働省の基準をわかりやすく解説",
    h1: "パワハラ 定義 6種類",
    description: "厚生労働省が定めるパワハラ6類型（身体的攻撃・精神的攻撃・人間関係からの切り離し等）をAIがわかりやすく解説。自分の状況に当てはめて確認。",
    features: [
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "6類型をチェックリスト化", text: "身体的攻撃・精神的攻撃・人間関係からの切り離し・過大要求・過小要求・個の侵害の6類型を事例付きで解説。" },
      { icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "グレーゾーンも判定", text: "「これってパワハラ？」というグレーゾーンの状況について、判断基準と対処法をAIが案内します。" },
      { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "2022年改正法に対応", text: "2022年4月から中小企業にも適用されたパワハラ防止法（改正労働施策総合推進法）の内容を反映。" },
    ],
    faqs: [
      { q: "パワハラの6類型とは何ですか？", a: "①身体的攻撃（暴行）②精神的攻撃（暴言・侮辱）③人間関係からの切り離し（無視・孤立化）④過大な要求⑤過小な要求⑥個の侵害（プライバシー侵害）の6類型です。パワハラ対策AIで自分の状況を当てはめた判断ができます。" },
      { q: "上司の強い口調・厳しい指導は全部パワハラになりますか？", a: "業務上の必要性・相当性があり人格否定を含まない指導はパワハラになりません。同じ行為でも文脈・頻度・相手の状況によって判断が変わります。パワハラ対策AIで状況を詳しく分析します。" },
      { q: "同僚や部下からのハラスメントもパワハラになりますか？", a: "パワハラは「優越的関係を背景にした言動」が要件ですが、同僚でも集団で特定の人を無視する・業務妨害するなどの行為はハラスメントに該当します。パワハラ対策AIで状況を判断します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "pawahara-taishoku-kyouhaku": {
    title: "パワハラ 証拠 集め方｜有効な証拠をAIがリスト化",
    h1: "パワハラ 証拠 集め方",
    description: "パワハラの証拠収集方法をAIが具体的に案内。録音・メール・日記・診断書など有効な証拠の集め方と保管方法を30秒で解説。",
    features: [
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "証拠の優先度ランク", text: "録音（最強）・メール・日記・医師の診断書・証人証言の順に証拠力を解説。今すぐできる証拠収集から案内します。" },
      { icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4", title: "安全な保管方法", text: "会社のパソコンを使わない・クラウド保存・複数箇所へのバックアップなど証拠の安全な保管方法を案内します。" },
      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "今日から始める収集計画", text: "パワハラが進行中でも今日から始められる証拠収集の手順・チェックリストをAIが生成します。" },
    ],
    faqs: [
      { q: "上司の暴言を録音するのは違法ですか？", a: "自分が会話に参加している場での録音は合法です（盗聴罪にはあたりません）。スマートフォンのボイスメモを活用しましょう。証拠として裁判でも使用できます。" },
      { q: "メール・チャットはパワハラの証拠になりますか？", a: "はい、非常に有効な証拠です。スクリーンショット・印刷・PDF保存でバックアップを複数箇所に取っておきましょう。会社のメールは退職後にアクセスできなくなる場合があります。" },
      { q: "医師の診断書はどのように証拠に使えますか？", a: "パワハラによる精神的苦痛・うつ病・適応障害などの診断書は損害の証明に使えます。産業医ではなく主治医（精神科・心療内科）の診断書が有効です。パワハラ対策AIで証拠収集全体を支援します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "job-harassment-mental-health": {
    title: "職場 ハラスメント メンタルヘルス 対処法｜AIが回復プランを提案",
    h1: "職場 ハラスメント メンタルヘルス",
    description: "職場のハラスメントによるメンタルヘルス不調への対処法をAIが提案。相談先・休職の取り方・回復プランを30秒で案内。",
    features: [
      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "心身のサインを見逃さない", text: "「眠れない・食欲がない・会社に行くと体が重い」などのサインが出たら休職・相談を検討すべき状態です。AIが状況を聞いて対処法を提案。" },
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "休職の取り方ガイド", text: "主治医の診断書・休職申請・傷病手当金（最大18ヶ月・給与の2/3）の申請方法を具体的に案内します。" },
      { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "職場復帰プランを策定", text: "休職後の段階的職場復帰（リワーク）・職場環境の改善交渉・転職検討の判断軸を提示します。" },
    ],
    faqs: [
      { q: "パワハラでうつ病になった場合、労災認定されますか？", a: "業務による心理的負荷が「強」と認定されれば労災になります。パワハラ・ハラスメントによる精神疾患も労災申請できます。証拠の収集・主治医の協力が重要です。パワハラ対策AIで申請の流れを案内します。" },
      { q: "メンタルヘルス不調で休職すると給与はどうなりますか？", a: "健康保険の傷病手当金（給与の約2/3・最大18ヶ月）が支給されます。社会保険料は会社負担分は継続、本人負担分は自己負担が必要です。パワハラ対策AIで手続き方法を案内します。" },
      { q: "メンタルヘルス不調を相談するのに適した医療機関は？", a: "精神科・心療内科への受診を推奨します。「会社には知られたくない」場合はかかりつけ医への相談から始めても構いません。産業医は会社側の立場であることを認識しましょう。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "seku-hara-pawahara-chigai": {
    title: "セクハラ パワハラ 違い｜ハラスメントの種類と対処法をAIが解説",
    h1: "セクハラ パワハラ 違い",
    description: "セクハラ・パワハラ・マタハラ・モラハラの違いをAIがわかりやすく解説。それぞれの対処法・相談先・法的根拠も案内。",
    features: [
      { icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", title: "ハラスメント種類を整理", text: "パワハラ・セクハラ・マタハラ・モラハラ・カスハラの定義・特徴・適用法律の違いを一覧で解説します。" },
      { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "複数ハラスメントの判断", text: "パワハラとセクハラが重なるケースなど複合的なハラスメントの判断方法と対処法を案内します。" },
      { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "種類別の相談先案内", text: "ハラスメントの種類に応じた最適な相談窓口（労働局・均等室・弁護士等）を自動案内します。" },
    ],
    faqs: [
      { q: "セクハラとパワハラの法的根拠の違いは？", a: "セクハラは男女雇用機会均等法、パワハラは労働施策総合推進法（パワハラ防止法）が根拠です。どちらも会社に防止措置義務があります。パワハラ対策AIで状況に合った対処法を案内します。" },
      { q: "マタハラはどこに相談すればいいですか？", a: "都道府県労働局雇用環境・均等部（室）が相談窓口です。妊娠・出産・育休を理由とした不利益取扱いは違法です。パワハラ対策AIで相談の準備を支援します。" },
      { q: "モラルハラスメント（モラハラ）は法律で禁止されていますか？", a: "職場のモラハラはパワハラの精神的攻撃類型に該当する場合があります。直接的な規制法はありませんが民事上の損害賠償請求の対象になります。パワハラ対策AIで状況を判断します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "company-pawahara-taio-manual": {
    title: "会社 パワハラ 対応 マニュアル｜2026年義務化対応をAIが支援",
    h1: "会社 パワハラ 対応 マニュアル",
    description: "会社・人事担当者向けのパワハラ対応マニュアルをAIが自動生成。2026年義務化対応・相談窓口設置・加害者対応まで30秒で作成。",
    features: [
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "法令準拠のマニュアル生成", text: "パワハラ防止法・労働施策総合推進法に準拠した相談窓口設置・調査手順・加害者処分のマニュアルを生成。" },
      { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", title: "研修プログラムの設計", text: "管理職向け・全従業員向けのパワハラ防止研修プログラムの設計・内容案をAIが自動生成します。" },
      { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", title: "再発防止策の立案", text: "パワハラ発生後の原因分析・組織文化改善・再発防止策をAIが提案。労働局への報告書も生成できます。" },
    ],
    faqs: [
      { q: "パワハラ防止法で会社が義務付けられていることは何ですか？", a: "①事業主の方針の明確化・周知啓発②相談窓口の設置③迅速かつ適切な対応④プライバシーの保護⑤不利益取扱いの禁止⑥再発防止措置の6項目が義務です。パワハラ対策AIで対応マニュアルを生成できます。" },
      { q: "社内相談窓口に相談があった場合、会社はどう対応すればいいですか？", a: "①相談者・行為者双方のプライバシー保護②中立的な調査③事実確認後の適切な処分④再発防止措置が必要です。パワハラ対策AIで具体的な対応手順書を生成できます。" },
      { q: "外部の相談窓口を使うメリットは何ですか？", a: "社内相談窓口に対する不信感・プライバシーへの不安がある場合、外部窓口（EAP・弁護士等）の活用が有効です。パワハラ対策AIで外部窓口の選び方・費用感を案内します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "pawahara-jibun-mamoru": {
    title: "パワハラ 自分を守る 方法｜今すぐできる対策をAIが提案",
    h1: "パワハラ 自分を守る 方法",
    description: "パワハラから自分を守る方法をAIが具体的に提案。証拠収集・相談窓口・休職・転職まで選択肢を整理して30秒でアドバイス。",
    features: [
      { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "今日からできる3ステップ", text: "①証拠収集の開始②信頼できる人への相談③相談窓口の確認 — 今すぐ始められる自己防衛の手順をAIが案内。" },
      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "一人で抱え込まない", text: "「言っても無駄」「自分が悪いのかも」という思いを乗り越え、適切な相談先につなげるサポートをします。" },
      { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "出口戦略の整理", text: "会社で戦う（法的対処）か、休職してリカバリーするか、転職するか — 状況に応じた最適な選択肢をAIが整理します。" },
    ],
    faqs: [
      { q: "パワハラを受けているが誰に相談すればいいかわかりません", a: "まず「信頼できる社内の人（人事・産業医以外）」または「外部の相談窓口（労働局・弁護士）」に相談することを推奨します。一人で抱え込まないことが最も重要です。パワハラ対策AIがまず話を聞きます。" },
      { q: "パワハラを我慢し続けるとどうなりますか？", a: "うつ病・適応障害などのメンタルヘルス不調・身体症状（不眠・食欲不振）が起きるリスクがあります。証拠も集めにくくなります。早期に行動することが自分を守ることになります。" },
      { q: "パワハラで転職を考えているが、転職先にバレますか？", a: "前職でのパワハラ被害は転職先に伝える義務はありません。退職理由は「一身上の都合」で問題ありません。パワハラ対策AIで転職を含めた出口戦略を整理できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

const SITE_URL = "https://pawahara-ai.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kw = KEYWORDS[slug];
  if (!kw) return {};
  return {
    title: kw.title,
    description: kw.description,
    other: { "article:modified_time": kw.lastUpdated },
    openGraph: {
      title: kw.title,
      description: kw.description,
      url: `${SITE_URL}/keywords/${slug}`,
      siteName: "パワハラ対策AI｜証拠収集・相談窓口・対処法を30秒でAIが案内",
      locale: "ja_JP",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: kw.h1 }],
    },
    twitter: { card: "summary_large_image", title: kw.title, description: kw.description, images: ["/og.png"] },
    alternates: { canonical: `${SITE_URL}/keywords/${slug}` },
  };
}

function FeatureIcon({ d }: { d: string }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20 shrink-0">
      <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </div>
  );
}

export default async function KeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kw = KEYWORDS[slug];
  if (!kw) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "dateModified": kw.lastUpdated,
    mainEntity: kw.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(239,68,68,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.10) 0%, transparent 50%), #0B0F1E" }}>
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
          <p className="text-red-400 text-sm font-medium tracking-wider mb-4">パワハラ対策AI｜証拠収集・相談窓口・対処法を案内</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #FECACA, #FFFFFF, #FED7AA)" }}>{kw.h1}</h1>
          <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "rgba(254,202,202,0.8)" }}>{kw.description}</p>
          <Link href="/tool" className="inline-flex items-center gap-2 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200" style={{ background: "linear-gradient(135deg, #EF4444, #F97316)", boxShadow: "0 0 30px rgba(239,68,68,0.4)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            無料でパワハラ対策AIに相談する
          </Link>
          <p className="text-xs mt-3" style={{ color: "rgba(254,202,202,0.5)" }}>登録不要・クレジットカード不要・無料3回</p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">特長</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {kw.features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
                <FeatureIcon d={f.icon} />
                <h3 className="font-bold mt-4 mb-2 text-white/90">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(254,202,202,0.7)" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">よくある質問</h2>
          <div className="space-y-4">
            {kw.faqs.map((f, i) => (
              <details key={i} className="rounded-2xl border border-white/10 backdrop-blur-sm group" style={{ background: "rgba(255,255,255,0.03)" }}>
                <summary className="cursor-pointer px-6 py-4 font-medium text-white/90 flex items-center justify-between list-none">
                  {f.q}
                  <svg className="w-5 h-5 text-red-400 transition-transform group-open:rotate-180 shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "rgba(254,202,202,0.7)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
          <div className="rounded-2xl p-8 border border-red-500/20" style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.05))" }}>
            <h2 className="text-xl font-bold mb-3 text-white/90">一人で抱え込まないでください</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(254,202,202,0.7)" }}>状況を話してください。AIが証拠収集・相談窓口・法的対処法を30秒でわかりやすく案内します。</p>
            <Link href="/tool" className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200" style={{ background: "linear-gradient(135deg, #EF4444, #F97316)", boxShadow: "0 0 30px rgba(239,68,68,0.4)" }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              無料でパワハラ対策AIを使う
            </Link>
          </div>
        </section>

        <p className="text-center text-xs text-white/40 mt-8 pb-8">最終更新: 2026年3月31日</p>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <CrossSell currentService="パワハラ対策AI" />
        </section>
      </main>
    </>
  );
}

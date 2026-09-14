import type { Language } from "./translations";

export type LocalizedString = { ja: string; en: string };

export type SunabaProjectCategory = "web" | "game" | "app";

export type SunabaProject = {
  id: string;
  category: SunabaProjectCategory;
  title: LocalizedString;
  description: LocalizedString;
  href: string;
  external?: boolean;
  status?: "live" | "wip";
  icon?: string;
};

export function pickLocalized(
  value: LocalizedString,
  language: Language,
): string {
  return value[language];
}

export const SUNABA_PROJECTS: readonly SunabaProject[] = [
  {
    id: "slang-ai-lab",
    category: "web",
    title: { ja: "Slang AI Lab", en: "Slang AI Lab" },
    description: {
      ja: "AI が生成した Slang シェーダーを、本物の Slang コンパイラ（WebAssembly）でブラウザ内コンパイルし、WebGPU でリアルタイムプレビューできるプレイグラウンド。",
      en: "AI-generated Slang shaders compiled in-browser by a real Slang compiler (WebAssembly) to WGSL, with real-time WebGPU preview.",
    },
    href: "https://slang-ai-lab.vercel.app",
    external: true,
  },
  {
    id: "hennani",
    category: "web",
    title: { ja: "へんなアニマル", en: "Hennani" },
    description: {
      ja: "へんなアニマルたちの診断ウェブアプリ",
      en: "Personality quiz web app featuring quirky animal characters.",
    },
    href: "https://hennani.com/",
    external: true,
  },
  {
    id: "edisuku",
    category: "web",
    title: { ja: "エディスク", en: "Edisuku" },
    description: {
      ja: "EDINET 開示データを自動収集・構造化するオープンソースの日本株スクリーナー。財務指標での絞り込み、時系列チャート、財務諸表ビューアに対応。",
      en: "Open-source Japanese stock screener that collects and structures EDINET filings — screening, time-series charts, and financial statement views.",
    },
    href: "https://edisuku.com/",
    external: true,
  },
  {
    id: "yfinance-screener",
    category: "web",
    title: { ja: "日本株スクリーニング", en: "Japan Stock Screener" },
    description: {
      ja: "yfinance と投資術を組み合わせた日本株の小型株・割安株スクリーナー。CSV 分析と検索プリセットに対応。",
      en: "Japanese small-cap and value stock screener powered by yfinance, with CSV export and search presets.",
    },
    href: "https://yfinance-jp-screener-search.vercel.app/",
    external: true,
  },
  {
    id: "gradient-thumbnail",
    category: "web",
    title: {
      ja: "グラデーションサムネイルメーカー",
      en: "Gradient Thumbnail Maker",
    },
    description: {
      ja: "note やブログ向けのメッシュグラデーション見出し画像を、ドラッグ操作で作成できる無料ツール。",
      en: "Free tool to create mesh-gradient thumbnails and OGP images for note and blogs with drag controls.",
    },
    href: "https://gradient-thumbnail-maker.testkun-08080.workers.dev/",
    external: true,
  },
  {
    id: "currency-converter",
    category: "web",
    title: {
      ja: "Currency Converter Board",
      en: "Currency Converter Board",
    },
    description: {
      ja: "250以上の通貨に対応したリアルタイム為替レートボードの作成・埋め込み無料ツール。画像エクスポートやブログ・EC サイトへの埋め込みに対応。",
      en: "Free real-time exchange rate board creator supporting 250+ currencies — embeddable in blogs and sites, with image export.",
    },
    href: "https://currency-converter-board.com/",
    external: true,
  },
  {
    id: "street-fighter-6",
    category: "game",
    title: { ja: "ストリートファイター6", en: "Street Fighter 6" },
    description: {
      ja: "CAPCOM にてリード TA として参画。キャラクタ・背景のシェーダー、LookDev 環境、パイプライン整備を担当。",
      en: "Lead TA at CAPCOM — character and background shaders, LookDev environments, and pipeline tooling.",
    },
    href: "https://www.streetfighter.com/6/ja-jp",
    external: true,
  },
  {
    id: "devil-may-cry-5",
    category: "game",
    title: { ja: "デビル メイ クライ 5", en: "Devil May Cry 5" },
    description: {
      ja: "CAPCOM にてシェーダーアーティストとして参画。キャラクタ・背景・カットシーン向けシェーダー開発と、PIX / RenderDoc を用いた GPU 最適化を担当。",
      en: "Shader artist at CAPCOM — character, background, and cutscene shaders; GPU optimization with PIX and RenderDoc.",
    },
    href: "https://www.devilmaycry.com/5/ja/",
    external: true,
  },
  {
    id: "mlb-series",
    category: "game",
    title: { ja: "MLBシリーズ", en: "MLB Series" },
    description: {
      ja: "SIE Malaysia Studio にて TA として参画。Maya シェーダーとゲーム最適化ツールの開発・保守を担当。",
      en: "TA at SIE Malaysia Studio — Maya shaders and game optimization tooling.",
    },
    href: "https://www.playstation.com/ja-jp/games/mlb-the-show-25/",
    external: true,
  },
  {
    id: "tlou2-remastered",
    category: "game",
    title: {
      ja: "The Last of Us Part II - Remastered",
      en: "The Last of Us Part II - Remastered",
    },
    description: {
      ja: "SIE にて TA サポート。Naughty Dog のワークフローセットアップ、PlayStation DevKit を使ったシェーダーデバッグ、データ提出フローの保守を担当。",
      en: "TA support at SIE — set up Naughty Dog's artist workflows, debugged shaders on PlayStation DevKit, and maintained asset submission pipelines.",
    },
    href: "https://www.playstation.com/ja-jp/games/the-last-of-us-part-ii-remastered/",
    external: true,
  },
  {
    id: "climate-station",
    category: "game",
    title: { ja: "Climate Station", en: "Climate Station" },
    description: {
      ja: "SIE Malaysia Studio にて Unity 向け C# エディタツール・マクロ開発、Jenkins / Git によるビルドパイプラインサポート、多言語キャプションフレームワークの保守を担当。",
      en: "TA at SIE Malaysia Studio — Unity C# editor tools and macros, build pipeline support via Jenkins and Git, and multilingual caption framework maintenance.",
    },
    href: "https://www.playstation.com/en-us/games/climate-station/",
    external: true,
  },
  {
    id: "life-office",
    category: "app",
    title: { ja: "LIFE OFFICE", en: "LIFE OFFICE" },
    description: {
      ja: "打刻という物理的な行為をスマホで再現し、仕事モードへの切り替えトリガーにする iOS アプリ。毎朝の出勤儀式を、スマホで。",
      en: "An iOS app that turns a physical clock-in gesture into a phone ritual — your morning switch into work mode.",
    },
    href: "https://apps.apple.com/jp/app/id6773638323",
    external: true,
    status: "live",
    icon: "/app-icons/life-office.png",
  },
  {
    id: "shitagaki",
    category: "app",
    title: { ja: "下書き", en: "Draft" },
    description: {
      ja: "写真を見ながら話すだけで、AI が Markdown 記事を生成する iOS アプリ。音声入力ファーストで、タイトル・アウトライン・録音メモも入力できる。",
      en: "An iOS app that generates a Markdown article with AI from you just talking while you look at photos — voice-first, with typing also supported.",
    },
    href: "https://apps.apple.com/app/id6774141263",
    external: true,
    status: "live",
    icon: "/app-icons/shitagaki.png",
  },
  {
    id: "watcher",
    category: "app",
    title: { ja: "Watcher", en: "Watcher" },
    description: {
      ja: "登録した監視テーマを AI が定期的に調査し、日本語レポートとしてまとめて届ける iOS アプリ。準備中。",
      en: "An iOS app where AI periodically researches the topics you register and delivers Japanese reports. Coming soon.",
    },
    href: "https://legal.testkun.net/watcher/",
    external: true,
    status: "wip",
    icon: "/app-icons/watcher.png",
  },
] as const;

export function getSunabaProjectsByCategory(category: SunabaProjectCategory) {
  return SUNABA_PROJECTS.filter((project) => project.category === category);
}

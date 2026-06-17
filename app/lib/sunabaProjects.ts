import type { Language } from "./translations";

export type LocalizedString = { ja: string; en: string };

export type SunabaProjectCategory = "web" | "game";

export type SunabaProject = {
  id: string;
  category: SunabaProjectCategory;
  title: LocalizedString;
  description: LocalizedString;
  href: string;
  external?: boolean;
};

export function pickLocalized(
  value: LocalizedString,
  language: Language,
): string {
  return value[language];
}

export const SUNABA_PROJECTS: readonly SunabaProject[] = [
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
    id: "visu-ai-innei",
    category: "web",
    title: { ja: "VisuAI-INNEI", en: "VisuAI-INNEI" },
    description: {
      ja: "GLSL シェーダーをリアルタイム編集・プレビューできる Web アプリ。AI による生成とパラメータ調整に対応。",
      en: "Real-time GLSL shader editor and preview playground with AI-assisted generation and live parameters.",
    },
    href: "https://visu-ai-innei.vercel.app/",
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
    id: "currency-converter",
    category: "web",
    title: {
      ja: "Currency Converter Board",
      en: "Currency Converter Board",
    },
    description: {
      ja: "Wise を毎日使う開発者向けの通貨変換ダッシュボード。複数通貨を一覧で比較。",
      en: "Currency conversion dashboard for daily Wise users — compare multiple rates at a glance.",
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
      ja: "CAPCOM にてシェーダーアーティストとして参画。キャラクタ・背景シェーダーとカットシーン向けシェーダーを担当。",
      en: "Shader artist at CAPCOM — character, background, and cutscene shader development.",
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
      ja: "SIE にて TA サポート。ワークフロー・開発環境のセットアップとシェーダー関連のサポートを担当。",
      en: "TA support at SIE — workflow setup, dev environment, and shader-related assistance.",
    },
    href: "https://www.playstation.com/ja-jp/games/the-last-of-us-part-ii-remastered/",
    external: true,
  },
  {
    id: "climate-station",
    category: "game",
    title: { ja: "Climate Station", en: "Climate Station" },
    description: {
      ja: "SIE Malaysia Studio にて Unity 向けシーンスクリプト・マクロ開発とビルド CI サポートを担当。",
      en: "Unity scene scripts and macros plus build CI support at SIE Malaysia Studio.",
    },
    href: "https://www.playstation.com/en-us/games/climate-station/",
    external: true,
  },
] as const;

export function getSunabaProjectsByCategory(category: SunabaProjectCategory) {
  return SUNABA_PROJECTS.filter((project) => project.category === category);
}

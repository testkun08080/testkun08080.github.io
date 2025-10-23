import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Wrapperコンポーネント - ページコンテンツのコンテナ
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - ラップする子要素
 * @param {Object} props.style - カスタムスタイル
 * @param {string} props.className - 追加のCSSクラス
 * @param {boolean} props.showSubtitle - サブタイトルを表示するか（デフォルト: true）
 * @param {string} props.subtitle - カスタムサブタイトル（指定しない場合はルートから自動取得）
 */
const Wrapper = ({
  children,
  style = {},
  className = "",
  showSubtitle = true,
  subtitle = null,
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  // ルートパスからサブタイトルを取得
  const getSubtitleFromPath = () => {
    if (subtitle) return subtitle; // カスタムサブタイトルが指定されている場合

    const path = location.pathname.split("/")[1]; // "/about" → "about"
    if (!path) return null; // ホームページの場合

    // i18nキーを試す（例: "about" → "about_section_title"）
    const titleKey = `${path}_title`;
    const translated = t(titleKey);

    // 翻訳が見つからない場合はパスをそのまま大文字で表示
    return translated !== titleKey ? translated : path.toUpperCase();
  };

  const displaySubtitle = showSubtitle ? getSubtitleFromPath() : null;

  return (
    <div
      className={`wrapper flex flex-col items-center justify-start w-full min-h-screen max-w-1/2 mx-auto pt-30 box-border ${className}`}
      style={style}
    >
      {displaySubtitle && (
        <div className="subtitle-container mb-8">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800pb-4">
            {displaySubtitle}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Wrapper;

/**
 * 全画面にノイズを描画するSVGコンポーネント
 * SVG feTurbulenceフィルターを使用してノイズエフェクトを実現
 *
 * position: absolute - ページ全体に適用（スクロールと一緒に移動）
 * これによりスクロール位置に関係なく一貫したノイズエフェクトを実現
 */
const NoiseCanvas = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        zIndex: 9999, // 最前面に表示
        pointerEvents: "none",
        opacity: 1, // ノイズの不透明度を調整
        mixBlendMode: "overlay", // ブレンドモードで自然に合成
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id="noiseFilter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="3.22"
            numOctaves="5"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
};

export default NoiseCanvas;

import { useId } from "react";

const RECT_PATH_D = "M 80 80 L 320 80 L 320 320 L 80 320 Z";

export default function Page() {
  const rawId = useId();
  const pathId = `dev-square-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <main className="flex min-h-dvh flex-col items-center gap-6 bg-slate-50 px-4 py-10 text-slate-900">
      <h1 className="text-lg font-bold tracking-tight">開発（静的）</h1>
      <p className="max-w-xl text-center text-sm text-slate-600">
        SVG path + textPath（アニメーションなし）
      </p>
      <svg
        viewBox="0 0 400 400"
        className="aspect-square w-full max-w-lg"
        role="img"
        aria-label="Rectangle path with textPath sample"
      >
        <defs>
          <path id={pathId} d={RECT_PATH_D} />
        </defs>
        <use
          href={`#${pathId}`}
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <text
          fill="#0f172a"
          fontSize="13"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          letterSpacing="0.06em"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            Lorem ipsum — 開発用サンプル。0123456789 ABCDEF
            パスに沿って一周します。
          </textPath>
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <a
          href="/dev-css-loop"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          CSS マーキー（無限ループ）サンプルへ
        </a>
        <a
          href="/dev-anime-loop"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          anime.js マーキー（translateX）へ
        </a>
        <a
          href="/dev-anime"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          anime.js でパスに沿って動かす版へ
        </a>
      </div>
    </main>
  );
}

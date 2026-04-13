import styles from "./DevCssLoop.module.css";

const LOOP_COPY =
  "Web Design Pallet Web Design Pallet Web Design Pallet Web Design Pallet";

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-10 bg-slate-50 px-4 py-10 text-slate-900">
      <div className="flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="text-lg font-bold tracking-tight">
          CSS 無限ループ（マーキー）
        </h1>
        <p className="text-sm text-slate-600">
          純粋な CSS{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            animation
          </code>{" "}
          のみ。同じ内容を 2 枚並べ、{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            translateX
          </code>{" "}
          と{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
            animation-delay
          </code>{" "}
          で継ぎ目なくループさせます。
        </p>
        <p className="text-xs text-slate-500">
          解説元:{" "}
          <a
            href="https://web-design-pallet.site/css-loop/"
            className="underline underline-offset-2 hover:text-slate-800"
            target="_blank"
            rel="noreferrer"
          >
            Web Design Pallet — テキストや画像の無限ループアニメーション
          </a>
        </p>
      </div>

      <section className="w-full max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">テキスト</h2>
        <div className={styles.textTrack}>
          <p className={`${styles.loopText} ${styles.textOdd}`}>{LOOP_COPY}</p>
          <p className={`${styles.loopText} ${styles.textEven}`}>{LOOP_COPY}</p>
        </div>
      </section>

      <section className="w-full max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">画像</h2>
        <div className={styles.imageTrack}>
          <img
            className={`${styles.loopImage} ${styles.imgOdd}`}
            src="/vite.svg"
            alt=""
            width={400}
            height={200}
            draggable={false}
          />
          <img
            className={`${styles.loopImage} ${styles.imgEven}`}
            src="/vite.svg"
            alt=""
            width={400}
            height={200}
            draggable={false}
          />
        </div>
        <p className="text-xs text-slate-500">
          同一画像を 2 枚並べた例（公開ディレクトリの{" "}
          <code className="rounded bg-slate-200 px-1">/vite.svg</code>）。
        </p>
      </section>

      <nav className="flex flex-wrap justify-center gap-4 text-sm">
        <a
          href="/dev-anime-loop"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          同じマーキーを anime.js で駆動（dev-anime-loop）
        </a>
        <a
          href="/dev"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          開発（静的）へ
        </a>
        <a
          href="/dev-anime"
          className="text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          anime.js（パス textPath）へ
        </a>
      </nav>
    </main>
  );
}

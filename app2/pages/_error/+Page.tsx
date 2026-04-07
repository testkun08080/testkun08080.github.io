import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  if (is404) {
    return (
      <section className="mx-auto mt-20 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <h1 className="m-0 text-5xl font-black text-white">404</h1>
        <p className="mt-4 text-slate-300">ページが見つかりません。</p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-2 font-semibold text-white"
        >
          トップへ
        </a>
      </section>
    );
  }
  return (
    <section className="mx-auto mt-20 max-w-xl rounded-2xl border border-red-400/30 bg-red-950/40 p-10 text-center">
      <h1 className="m-0 text-4xl font-black text-white">エラー</h1>
      <p className="mt-4 text-slate-300">問題が発生しました。</p>
    </section>
  );
}

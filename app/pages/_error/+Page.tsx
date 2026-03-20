import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  if (is404) {
    return (
      <section className="mx-auto mt-20 max-w-xl rounded-2xl border border-black/20 bg-white/60 p-10 text-center shadow-lg">
        <h1 className="m-0 text-5xl font-black">404</h1>
        <p className="mt-4 text-slate-700">The page could not be found.</p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full border border-black/20 bg-white px-6 py-2 font-semibold text-slate-800"
        >
          Back to Top
        </a>
      </section>
    );
  }
  return (
    <section className="mx-auto mt-20 max-w-xl rounded-2xl border border-red-400/40 bg-white/60 p-10 text-center shadow-lg">
      <h1 className="m-0 text-4xl font-black">Internal Error</h1>
      <p className="mt-4 text-slate-700">Something went wrong.</p>
    </section>
  );
}

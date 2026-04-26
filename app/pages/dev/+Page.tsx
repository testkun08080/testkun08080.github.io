const pageModules = import.meta.glob("../*/+Page.tsx");

const devLinks = Object.keys(pageModules)
  .map((filePath) => filePath.replace("../", "").replace("/+Page.tsx", ""))
  .filter((route) => route.startsWith("dev") && route !== "dev")
  .sort()
  .map((route) => `/${route}`);

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-6 py-10 text-slate-900">
      <h1 className="text-xl font-bold">dev ページ一覧</h1>
      <ul className="list-inside list-disc space-y-2">
        {devLinks.map((href) => (
          <li key={href}>
            <a
              href={href}
              className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
            >
              {href}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

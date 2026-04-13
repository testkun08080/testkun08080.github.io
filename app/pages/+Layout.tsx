import type { ReactNode } from "react";
import { ScrollShell } from "../components/ScrollShell";
import "./Layout.css";
import "./tailwind.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ScrollShell>
      <div id="page-content" className="relative z-10 min-h-dvh">
        {children}
      </div>
    </ScrollShell>
  );
}

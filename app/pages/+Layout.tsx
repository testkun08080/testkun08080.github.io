import { useState } from "react";
import type { ReactNode } from "react";
import { MobileMenu } from "../components/MobileMenu";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import styles from "../components/SiteLayout.module.css";
import { useGlobalEffects } from "../hooks/useGlobalEffects";
import { LanguageProvider } from "../lib/LanguageContext";
import "./Layout.css";
import "./tailwind.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SiteShell>{children}</SiteShell>
    </LanguageProvider>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useGlobalEffects();

  return (
    <div className={styles.shell}>
      <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="page-content" className={styles.content}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

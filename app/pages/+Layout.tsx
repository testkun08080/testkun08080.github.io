<<<<<<< HEAD
import type { ReactNode } from "react";
import { ScrollShell } from "../components/ScrollShell";
=======
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { MobileMenu } from "../components/MobileMenu";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { WanderingHeyHey } from "../components/WanderingHeyHey";
import styles from "../components/SiteLayout.module.css";
import { useGlobalEffects } from "../hooks/useGlobalEffects";
import { LanguageProvider } from "../lib/LanguageContext";
>>>>>>> dev
import "./Layout.css";
import "./tailwind.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
<<<<<<< HEAD
    <ScrollShell>
      <div id="page-content" className="relative z-10 min-h-dvh">
        {children}
      </div>
    </ScrollShell>
=======
    <LanguageProvider>
      <SiteShell>{children}</SiteShell>
    </LanguageProvider>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  const { urlPathname } = usePageContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introRevealed, setIntroRevealed] = useState(false);
  useGlobalEffects();
  const isIntroPage = urlPathname === "/";
  const showChrome = !isIntroPage || introRevealed;

  useEffect(() => {
    if (!isIntroPage) {
      setIntroRevealed(false);
      return;
    }

    const onScroll = () => {
      // ~half of intro scroll track (scene is 200vh → ~1 viewport of scroll for full progress)
      const threshold = window.innerHeight * 0.48;
      setIntroRevealed(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isIntroPage]);

  return (
    <div className={`${styles.shell} noise-effect`}>
      <WanderingHeyHey />
      <div className={showChrome ? styles.chromeVisible : styles.chromeHidden}>
        <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
      </div>
      {showChrome && <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />}
      <main
        id="page-content"
        className={isIntroPage ? styles.contentIntro : styles.content}
      >
        {children}
      </main>
      <div className={showChrome ? styles.chromeVisible : styles.chromeHidden}>
        <SiteFooter />
      </div>
    </div>
>>>>>>> dev
  );
}

import { SunabaSection } from "../../components/SunabaSection";
import { LanguageProvider } from "../../lib/LanguageContext";

export default function Page() {
  return (
    <LanguageProvider>
      <SunabaSection />
    </LanguageProvider>
  );
}

import { DocumentChapter } from "./DocumentChapter";
import { HeroChapter } from "./HeroChapter";
import { TestAndIntroChapter } from "./TestAndIntroChapter";

export function PortfolioScrollExperience() {
  return (
    <div className="portfolio-root text-[#0f172a]">
      <HeroChapter />
      <DocumentChapter />
      <TestAndIntroChapter />
    </div>
  );
}

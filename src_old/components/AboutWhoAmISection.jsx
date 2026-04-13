import React from "react";
import AboutProfileCard from "./AboutProfileCard";
import AboutQualifications from "./AboutQualifications";
import AboutTools from "./AboutTools";
import AboutProgrammingLanguages from "./AboutProgrammingLanguages";
import AboutHobbies from "./AboutHobbies";
import { useTranslation } from "react-i18next";

const AboutWhoAmISection = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full max-w-[1512px] mx-auto flex flex-col items-center gap-[33px] bg-transparent">
      <h2 className="font-[Inter] text-4xl font-extrabold text-black text-center m-0">
        {t("about_section_title2")}
      </h2>
      {/* 縦並び: プロフィールカードと資格 */}
      <div className="w-full flex flex-col gap-3 items-center">
        <AboutProfileCard />
        <AboutQualifications />
      </div>
      {/* 横並び: ツール・言語・趣味 */}
      <div className="w-full flex flex-row gap-5 justify-center items-start mt-9">
        <AboutTools />
        <AboutProgrammingLanguages />
        <AboutHobbies />
      </div>
    </section>
  );
};

export default AboutWhoAmISection;

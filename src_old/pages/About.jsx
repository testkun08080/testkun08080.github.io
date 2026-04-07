import React from "react";
import { useTranslation } from "react-i18next";
import AboutProfileCard from "../components/AboutProfileCard";
import AboutQualifications from "../components/AboutQualifications";
import AboutTools from "../components/AboutTools";
import AboutProgrammingLanguages from "../components/AboutProgrammingLanguages";
import AboutHobbies from "../components/AboutHobbies";
import Wrapper from "../components/Wrapper";

const About = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      {/* メインセクション - 名前と挨拶 */}
      <section className="flex flex-col items-center gap-10 mb-16">
        {/* <h1 className="font-[Inter] text-xl font-extrabold text-black text-center m-0">
          {t("about_name")}
        </h1> */}
        <p className="text-xl font-normal text-[#093A49] text-center m-0 leading-[1.21] whitespace-pre-line">
          {t("about_greeting")}
        </p>
        <a
          href="/resume_en.pdf"
          download
          className="flex items-center justify-center w-[161px] h-[65px] bg-[#D9D9D9] rounded-[67.5px] no-underline mt-6"
        >
          <span className="font-normal text-base text-black w-[97px] h-[36px] flex items-center justify-center">
            {t("about_resume")}
          </span>
        </a>
      </section>

      {/* スキル・自己紹介セクション */}
      <section className="mx-auto flex flex-col items-center gap-[33px] bg-transparent">
        <h2 className=" text-4xl font-extrabold text-black text-center m-0">
          {t("about_section_title2")}
        </h2>

        {/* プロフィールカードと資格 */}
        <div className="flex flex-col gap-3">
          <AboutProfileCard />
          <div className="flex flex-col gap-6">
            <AboutQualifications />
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <AboutTools />
              </div>
              <div className="w-full md:w-1/3">
                <AboutProgrammingLanguages />
              </div>
              <div className="w-full md:w-1/3">
                <AboutHobbies />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export default About;

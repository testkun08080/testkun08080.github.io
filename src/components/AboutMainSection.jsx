import React from "react";
import { useTranslation } from "react-i18next";

const AboutMainSection = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full flex flex-col items-center gap-10">
      <h1 className="font-[Inter] text-xl font-extrabold text-black text-center m-0">
        {t("about_name")}
      </h1>
      <p className="font-[Inter] text-2xl font-normal text-[#093A49] text-center m-0 leading-[1.21] whitespace-pre-line">
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
  );
};

export default AboutMainSection;

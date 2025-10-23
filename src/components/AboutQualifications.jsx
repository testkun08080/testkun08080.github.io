import React from "react";
import { useTranslation } from "react-i18next";

const AboutQualifications = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-transparent text-left flex flex-col items-start gap-2">
      <div className="font-semibold inline-block align-bottom text-2xl text-black text-left">
        {t("about_qualifications_title")}
      </div>

      <hr className="w-full border-t-2 border-black" />
      <div className="font-normal text-base text-black leading-[1.21] whitespace-pre-line">
        {t("about_qualifications_desc")}
      </div>
    </div>
  );
};

export default AboutQualifications;

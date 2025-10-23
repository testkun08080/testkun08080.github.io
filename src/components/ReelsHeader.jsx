import React from "react";
import { useTranslation } from "react-i18next";

const ReelsHeader = () => {
  const { t } = useTranslation();
  return (
    <h1 className="text-4xl font-extrabold text-[#222] my-10 mb-6">
      {t("reels_title")}
    </h1>
  );
};

export default ReelsHeader;

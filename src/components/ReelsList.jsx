import React from "react";
import ReelCard from "./ReelCard";
import { useTranslation } from "react-i18next";

const ReelsList = () => {
  const { t } = useTranslation();
  const reels = [
    {
      id: 1,
      period: "2022-2024",
      title: t("reels_2022_2024"),
      description: t("reels_2022_2024_desc"),
      youtubeId: "pMOKLQ0rxhU",
    },
    {
      id: 2,
      period: "2017-2022",
      title: t("reels_2017_2022"),
      description: t("reels_2017_2022_desc"),
      youtubeId: "L2ci7xq4EEk",
    },
  ];

  return (
    <div className="flex flex-col gap-10 items-center w-full">
      {reels.map((reel) => (
        <ReelCard key={reel.id} {...reel} />
      ))}
    </div>
  );
};

export default ReelsList;

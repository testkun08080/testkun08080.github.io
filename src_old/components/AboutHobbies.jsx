import React from "react";
import { useTranslation } from "react-i18next";

const AboutHobbies = () => {
  const { t } = useTranslation();
  const hobbies = t("about_hobbies_list", { returnObjects: true });
  return (
    <div className="bg-transparent text-left flex flex-col items-start gap-2">
      <div className="font-semibold inline-block align-bottom text-2xl text-black">
        {t("about_hobbies_title")}
      </div>
      <hr className="w-full border-t-2 border-black" />
      <div className="grid grid-cols-2 px-6 gap-x-6 gap-y-2">
        {hobbies.map((hobby) => (
          <li
            key={hobby}
            className="font-normal text-xl text-black leading-[1.21]"
          >
            {hobby}
          </li>
        ))}
      </div>
    </div>
  );
};

export default AboutHobbies;

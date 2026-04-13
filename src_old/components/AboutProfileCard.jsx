import React from "react";
import selfy from "../assets/profile_selfy.png";
import { EmailShareButton, EmailIcon } from "react-share";
import { useTranslation } from "react-i18next";
import { getMailtoLink, getSocialList } from "../config/contacts";

const AboutProfileCard = () => {
  const { t } = useTranslation();
  const socialList = getSocialList();

  return (
    <div className="bg-transparent rounded-2xl p-6 text-center flex flex-col items-center gap-5">
      {/* Selfy画像 */}
      <img
        src={selfy}
        alt="selfy"
        className="w-[250px] h-[250px] rounded-2xl object-cover mb-2"
      />
      {/* 名前 */}
      <div className="font-bold text-2xl mb-1">{t("about_profile_name")}</div>
      {/* 連絡先 */}
      <div className="font-normal text-base text-black mb-2 whitespace-pre-line">
        {t("about_profile_contact")}
      </div>
      {/* SNSアイコン */}
      <div className="flex flex-row gap-[15px] justify-center items-center mt-2">
        <EmailShareButton
          url={getMailtoLink("Contact from Portfolio", "")}
          subject="Contact from Portfolio"
          body=""
        >
          <EmailIcon size={38} round />
        </EmailShareButton>
        {socialList.map((sns) => (
          <a
            key={sns.id}
            href={sns.url}
            target="_blank"
            rel="noopener noreferrer"
            title={t(sns.name)}
            className="flex items-center justify-center w-[38px] h-[38px]"
          >
            <i className={sns.iconClass} style={{ fontSize: 38 }}></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AboutProfileCard;

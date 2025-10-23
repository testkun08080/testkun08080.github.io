import React from "react";
import { EmailShareButton, EmailIcon } from "react-share";
import { CONTACT_INFO, getMailtoLink, getSocialList } from "../config/contacts";

const SnsIcons = ({ size = 38, gap = 15 }) => {
  const socialList = getSocialList();

  return (
    <div className="flex flex-row justify-center items-center" style={{ gap }}>
      <EmailShareButton
        url={getMailtoLink("Contact from Portfolio", "")}
        subject="Contact from Portfolio"
        body=""
      >
        <EmailIcon size={size} round />
      </EmailShareButton>
      {socialList.map((sns) => (
        <a
          key={sns.id}
          href={sns.url}
          target="_blank"
          rel="noopener noreferrer"
          title={sns.username}
          className="flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <i className={sns.iconClass} style={{ fontSize: size }}></i>
        </a>
      ))}
    </div>
  );
};

export default SnsIcons;

import React from "react";
import { EmailShareButton, EmailIcon } from "react-share";

const SNS = [
  {
    name: "GitHub",
    url: "https://github.com/testkun08080",
    iconClass: "devicon-github-original colored",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/testkun08080",
    iconClass: "devicon-linkedin-plain colored",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/testkun08080",
    iconClass: "devicon-twitter-original colored",
  },
];

const SnsIcons = ({ size = 38, gap = 15 }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <EmailShareButton url={"mailto:testkun.08080@gmail.com"} subject="Contact from Portfolio" body="">
      <EmailIcon size={size} round />
    </EmailShareButton>
    {SNS.map((sns) => (
      <a
        key={sns.name}
        href={sns.url}
        target="_blank"
        rel="noopener noreferrer"
        title={sns.name}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }}
      >
        <i className={sns.iconClass} style={{ fontSize: size }}></i>
      </a>
    ))}
  </div>
);

export default SnsIcons; 
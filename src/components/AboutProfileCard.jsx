import React from 'react';
import selfy from '../assets/profile_selfy.png';
import { EmailShareButton, EmailIcon } from "react-share";
import { useTranslation } from 'react-i18next';

const SNS = [
  {
    name: 'about_profile_github',
    url: 'https://github.com/testkun08080',
    iconClass: 'devicon-github-original colored',
  },
  {
    name: 'about_profile_linkedin',
    url: 'https://linkedin.com/in/testkun08080',
    iconClass: 'devicon-linkedin-plain colored',
  },
  {
    name: 'about_profile_twitter',
    url: 'https://twitter.com/testkun08080',
    iconClass: 'devicon-twitter-original colored',
  },
];

const AboutProfileCard = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      background: 'transparent',
      borderRadius: 16,
      padding: 24,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}>
      {/* Selfy画像 */}
      <img src={selfy} alt="selfy" style={{ width: 250, height: 250, borderRadius: 16, objectFit: 'cover', marginBottom: 8 }} />
      {/* 名前 */}
      <div className="font-bold text-2xl mb-1">{t('about_profile_name')}</div>
      {/* 連絡先 */}
      <div className="font-normal text-base text-black mb-2 whitespace-pre-line">
        {t('about_profile_contact')}
      </div>
      {/* SNSアイコン */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 15, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
        <EmailShareButton url={"mailto:testkun.08080@gmail.com"} subject="Contact from Portfolio" body="">
          <EmailIcon size={38} round />
        </EmailShareButton>
        {SNS.map((sns) => (
          <a
            key={sns.name}
            href={sns.url}
            target="_blank"
            rel="noopener noreferrer"
            title={t(sns.name)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38 }}
          >
            <i className={sns.iconClass} style={{ fontSize: 38 }}></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AboutProfileCard; 
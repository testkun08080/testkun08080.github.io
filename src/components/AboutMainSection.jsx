import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutMainSection = () => {
  const { t } = useTranslation();
  return (
    <section style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
      <h1 style={{
        fontFamily: 'Inter',
        fontWeight: 800,
        color: '#000',
        textAlign: 'center',
        margin: 0,
      }}
      className="text-5xl font-extrabold text-black text-center m-0"
      >
        {t('about_name')}
      </h1>
      <p style={{
        fontFamily: 'Inter',
        fontWeight: 400,
        color: '#093A49',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1.21,
        whiteSpace: 'pre-line',
      }}
      className="text-2xl font-normal text-[#093A49] text-center m-0 leading-[1.21] whitespace-pre-line"
      >
        {t('about_greeting')}
      </p>
      <a
        href="/resume_en.pdf"
        download
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 161,
          height: 65,
          background: '#D9D9D9',
          borderRadius: 67.5,
          textDecoration: 'none',
          marginTop: 24,
        }}
      >
        <span
          className="font-normal text-base text-black w-[97px] h-[36px] flex items-center justify-center"
        >
          {t('about_resume')}
        </span>
      </a>
    </section>
  );
};

export default AboutMainSection; 
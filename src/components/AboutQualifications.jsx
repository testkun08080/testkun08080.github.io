import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutQualifications = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      background: 'transparent',
      padding: 24,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 16,
    }}>
      <div className="font-semibold text-2xl text-black mb-2 text-left">{t('about_qualifications_title')}</div>
      <hr className="w-full border-t-2 border-black mb-4" />
      <div className="font-normal text-xl text-black leading-[1.21] whitespace-pre-line">
        {t('about_qualifications_desc')}
      </div>
    </div>
  );
};

export default AboutQualifications; 
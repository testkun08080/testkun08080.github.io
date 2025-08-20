import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutHobbies = () => {
  const { t } = useTranslation();
  const hobbies = t('about_hobbies_list', { returnObjects: true });
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
      <div className="font-semibold text-2xl text-black mb-2">{t('about_hobbies_title')}</div>
      <hr className="w-full border-t-2 border-black mb-4" />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {hobbies.map(hobby => (
          <li key={hobby} className="font-normal text-xl text-black leading-[1.21] mb-1">{hobby}</li>
        ))}
      </ul>
    </div>
  );
};

export default AboutHobbies; 
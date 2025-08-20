import React from 'react';
import AboutProfileCard from './AboutProfileCard';
import AboutQualifications from './AboutQualifications';
import AboutTools from './AboutTools';
import AboutProgrammingLanguages from './AboutProgrammingLanguages';
import AboutHobbies from './AboutHobbies';
import { useTranslation } from 'react-i18next';

const AboutWhoAmISection = () => {
  const { t } = useTranslation();
  return (
    <section style={{ width: '100%', maxWidth: 1512, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 33, background: 'transparent' }}>
      <h2 style={{
        fontFamily: 'Inter',
        fontWeight: 800,
        color: '#000',
        textAlign: 'center',
        margin: 0,
      }}
      className="text-4xl font-extrabold text-black text-center m-0"
      >
        {t('about_section_title2')}
      </h2>
      {/* 縦並び: プロフィールカードと資格 */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>
        <AboutProfileCard />
        <AboutQualifications />
      </div>
      {/* 横並び: ツール・言語・趣味 */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 36, justifyContent: 'center', alignItems: 'flex-start', marginTop: 36 }}>
        <AboutTools />
        <AboutProgrammingLanguages />
        <AboutHobbies />
      </div>
    </section>
  );
};

export default AboutWhoAmISection; 
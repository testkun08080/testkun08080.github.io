import React from 'react';
import Wrapper from '../components/Wrapper';
import { useTranslation } from 'react-i18next';

const Sunaba = () => {
  const { t, i18n } = useTranslation();
  return (
    <Wrapper style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div
        className="font-bold text-[100px] leading-[1.21] tracking-[0.42em] text-[#D6EAF0] text-center" style={{ WebkitTextStroke: '1px #000', textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
      >
        {t('sunaba_jp')}
      </div>
      <div
        className="font-medium text-xl leading-[1.21] tracking-[0.64em] text-[#D6EAF0] text-center mt-4" style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
      >
        {t('sunaba_en')}
      </div>
      {/* Navigation Bar */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 62,
          padding: '9px 0',
          marginTop: 48,
        }}
        aria-label="Page navigation"
      >
        <a
          href="/about"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.21,
            color: '#000',
            textDecoration: 'none',
            letterSpacing: '0.42em',
            transition: 'color 0.2s',
          }}
          className="hover:text-[#093A49] focus:text-[#093A49]"
        >
          {t('about', { defaultValue: i18n.language === 'ja' ? 'アバウト' : 'About' })}
        </a>
        <a
          href="/reels"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.21,
            color: '#000',
            textDecoration: 'none',
            letterSpacing: '0.42em',
            transition: 'color 0.2s',
          }}
          className="hover:text-[#093A49] focus:text-[#093A49]"
        >
          {t('reels', { defaultValue: i18n.language === 'ja' ? 'リール' : 'Reels' })}
        </a>
        <a
          href="/contact"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.21,
            color: '#000',
            textDecoration: 'none',
            letterSpacing: '0.42em',
            transition: 'color 0.2s',
          }}
          className="hover:text-[#093A49] focus:text-[#093A49]"
        >
          {t('contact', { defaultValue: i18n.language === 'ja' ? 'コンタクト' : 'Contact' })}
        </a>
      </nav>
    </Wrapper>
  );
};

export default Sunaba; 
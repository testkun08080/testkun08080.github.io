import React from 'react';
import NoiseCanvas from '../components/canvas';
import icon404 from '../assets/404_icon.png';
import Wrapper from '../components/Wrapper';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#E0D4C5',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <NoiseCanvas />
      <Wrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* 404テキスト */}
        <div
          className="font-semibold text-[256px] leading-[1.87em] text-black text-center mt-10 mb-0 z-[1]"
        >
          {t('notfound_404')}
        </div>
        {/* アイコン画像 */}
        <img
          src={icon404}
          alt="404 icon"
          style={{
            width: 177,
            height: 177,
            objectFit: 'contain',
            margin: '0 auto',
            display: 'block',
            marginTop: -120,
            marginBottom: 32,
            zIndex: 1,
          }}
        />
        {/* メッセージ */}
        <div
          className="font-normal text-2xl leading-[1.87em] text-black text-center max-w-[1181px] mx-auto mb-8 z-[1]"
        >
          {t('notfound_message').split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        {/* ホームへ戻るボタン */}
        <a
          href="/"
          style={{
            display: 'inline-block',
            background: '#D9D9D9',
            color: '#000',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 16,
            lineHeight: '1.87em',
            borderRadius: 67.5,
            padding: '14px 48px',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginTop: 8,
            marginBottom: 40,
            zIndex: 1,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#b8b8b8'}
          onMouseOut={e => e.currentTarget.style.background = '#D9D9D9'}
        >
          {t('notfound_home')}
        </a>
      </Wrapper>
    </div>
  );
};

export default NotFound;

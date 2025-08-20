import React from 'react';
import homeIcon from '../assets/header_homebutton.png';
import languageIcon from '../assets/header_languageicon.png';
import menuIcon from '../assets/header_menuicon.svg';
import { useMenuDrawer } from './MenuDrawerContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { openMenu } = useMenuDrawer();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja');
  };

  return (
    <header style={{
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 60px',
      gap: 19,
      boxSizing: 'border-box',
      // boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      {/* ホームボタン */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', width: 32, height: 32 }}>
        <img src={homeIcon} alt={t('home')} style={{ width: 32, height: 32 }} />
      </a>
      {/* 中央スペース */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '9px 103px' }} />
      {/* 言語アイコン */}
      <button onClick={toggleLanguage} style={{ background: 'none', border: 'none', padding: 0, marginRight: 19, cursor: 'pointer' }}>
        <img src={languageIcon} alt={t('language')} style={{ width: 42, height: 42 }} />
      </button>
      <span style={{marginRight: 19, fontWeight: 'bold'}}>{i18n.language === 'ja' ? 'JA' : 'EN'}</span>
      {/* メニューボタン */}
      <button onClick={openMenu} style={{ background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', width: 32, height: 18.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={menuIcon} alt={t('menu')} style={{ width: 32, height: 18.2 }} />
      </button>
    </header>
  );
};

export default Header; 
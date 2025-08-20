import React from 'react';
import { useTranslation } from 'react-i18next';

const menuLinks = [
  { key: 'about', href: '/about' },
  { key: 'reels', href: '/reels' },
  { key: 'contact', href: '/contact', contact: true },
];

const MenuDrawer = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const handleNavigate = (href) => {
    window.location.href = href;
    onClose();
  };

  return (
    <>
      {/* ブラーオーバーレイ */}
      <div
        style={{
          display: open ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.35)', // ここを暗くする
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      {/* メニュー本体（中央センター） */}
      <div
        style={{
          display: open ? 'flex' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}
        aria-hidden={!open}
        onClick={onClose} // 追加: メニュー外クリックで閉じる
      >
        <div
          style={{
            width: 300,
            height: 288,
            background: 'rgba(34, 34, 34, 0)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '9px 0',
            position: 'relative',
          }}
          onClick={e => e.stopPropagation()} // 追加: メニュー内クリックは伝播防止
        >
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: 'none',
              // fontSize: 28, // replaced by Tailwind class
              color: '#F8F5F5',
              cursor: 'pointer',
            }}
            aria-label="Close menu"
            className="text-2xl"
          >
            ×
          </button>
          {/* メニューリスト */}
          {menuLinks.map((item) => (
            <div
              key={item.key}
              className={`menu-item${item.contact ? ' contact' : ''} text-4xl`}
              tabIndex={0}
              role="button"
              onClick={() => handleNavigate(item.href)}
              style={{ color: '#F9F9F9' }}
            >
              {t(item.key, {
                defaultValue:
                  item.key === 'about'
                    ? i18n.language === 'ja' ? 'アバウト' : 'About'
                    : item.key === 'reels'
                    ? i18n.language === 'ja' ? 'リール' : 'Reels'
                    : item.key === 'contact'
                    ? i18n.language === 'ja' ? 'コンタクト' : 'Contact'
                    : item.key
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuDrawer; 
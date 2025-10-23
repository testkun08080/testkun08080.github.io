import React from "react";
import { useTranslation } from "react-i18next";

const menuLinks = [
  { key: "about", href: "/about" },
  { key: "reels", href: "/reels" },
  { key: "contact", href: "/contact", contact: true },
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
        className={`${open ? "block" : "hidden"} fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.35)] backdrop-blur-[12px] z-[1000]`}
        onClick={onClose}
      />
      {/* メニュー本体（中央センター） */}
      <div
        className={`${open ? "flex" : "hidden"} fixed top-0 left-0 w-screen h-screen items-center justify-center z-[1001]`}
        aria-hidden={!open}
        onClick={onClose}
      >
        <div
          className="w-[300px] h-[288px] bg-[rgba(34,34,34,0)] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0)] flex flex-col items-center justify-center gap-[6px] py-[9px] px-0 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-none border-none text-2xl text-[#F8F5F5] cursor-pointer"
            aria-label="Close menu"
          >
            ×
          </button>
          {/* メニューリスト */}
          {menuLinks.map((item) => (
            <div
              key={item.key}
              className={`menu-item${item.contact ? " contact" : ""} text-4xl text-[#F9F9F9]`}
              tabIndex={0}
              role="button"
              onClick={() => handleNavigate(item.href)}
            >
              {t(item.key, {
                defaultValue:
                  item.key === "about"
                    ? i18n.language === "ja"
                      ? "アバウト"
                      : "About"
                    : item.key === "reels"
                      ? i18n.language === "ja"
                        ? "リール"
                        : "Reels"
                      : item.key === "contact"
                        ? i18n.language === "ja"
                          ? "コンタクト"
                          : "Contact"
                        : item.key,
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MenuDrawer;

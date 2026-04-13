import React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../assets/header_homebutton.png";
import languageIcon from "../assets/header_languageicon.png";
import menuIcon from "../assets/header_menuicon.svg";
import { useMenuDrawer } from "./MenuDrawerContext";
import { useTranslation } from "react-i18next";

const navigationLinks = [
  { key: "about", href: "/about" },
  { key: "reels", href: "/reels" },
  { key: "contact", href: "/contact" },
];

const Header = () => {
  const { openMenu } = useMenuDrawer();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "ja" ? "en" : "ja");
  };

  return (
    <header className="w-full fixed z-[100] flex items-center justify-between p-4 px-6 md:p-10 md:px-30 box-border">
      {/* ホームボタン */}
      <Link to="/" className="flex items-center w-8 h-8">
        <img src={homeIcon} alt={t("home")} className="w-8 h-8" />
      </Link>

      {/* デスクトップナビゲーション（中央） */}
      <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
        {navigationLinks.map((link) => (
          <Link
            key={link.key}
            to={link.href}
            className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>

      {/* 右側のコントロール */}
      <div className="flex items-center gap-4">
        {/* 言語切り替え */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-none border-none p-0 cursor-pointer"
        >
          <img
            src={languageIcon}
            alt={t("language")}
            className="w-[42px] h-[42px]"
          />
          <span className="font-bold">
            {i18n.language === "ja" ? "JA" : "EN"}
          </span>
        </button>

        {/* モバイルメニューボタン */}
        <button
          onClick={openMenu}
          className="md:hidden bg-none border-none p-0 cursor-pointer w-8 h-[18.2px] flex items-center justify-center"
        >
          <img src={menuIcon} alt={t("menu")} className="w-8 h-[18.2px]" />
        </button>
      </div>
    </header>
  );
};

export default Header;

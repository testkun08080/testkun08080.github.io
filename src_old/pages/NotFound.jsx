import React from "react";
import NoiseCanvas from "../components/canvas";
import icon404 from "../assets/404_icon.png";
import Wrapper from "../components/Wrapper";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-screen bg-[#E0D4C5] relative flex flex-col items-center justify-center overflow-hidden">
      <NoiseCanvas />
      <Wrapper>
        {/* 404テキスト */}
        <div className="font-semibold text-[256px] leading-[1.87em] text-black text-center mt-10 mb-0 z-[1]">
          {t("notfound_404")}
        </div>
        {/* アイコン画像 */}
        <img
          src={icon404}
          alt="404 icon"
          className="w-[177px] h-[177px] object-contain mx-auto block -mt-[120px] mb-8 z-[1]"
        />
        {/* メッセージ */}
        <div className="font-normal text-2xl leading-[1.87em] text-black text-center max-w-[1181px] mx-auto mb-8 z-[1]">
          {t("notfound_message")
            .split("\n")
            .map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </div>
        {/* ホームへ戻るボタン */}
        <a
          href="/"
          className="inline-block bg-[#D9D9D9] text-black font-[Inter] font-normal text-base leading-[1.87em] rounded-[67.5px] px-12 py-[14px] no-underline shadow-[0_2px_8px_rgba(0,0,0,0.04)] mt-2 mb-10 z-[1] transition-[background] duration-200 hover:bg-[#b8b8b8]"
        >
          {t("notfound_home")}
        </a>
      </Wrapper>
    </div>
  );
};

export default NotFound;

import React from "react";
import langOpengl from "../assets/lang_opengl.svg";
import langHlsl from "../assets/lang_hlsl.svg";
import langMaya from "../assets/lang_maya.svg";
import langReact from "../assets/lang_react.svg";
import { useTranslation } from "react-i18next";

const languages = [
  { name: "Python", devicon: "devicon-python-plain colored" },
  { name: "OpenGL", svg: langOpengl },
  { name: "HLSL", svg: langHlsl },
  { name: "Maya", svg: langMaya },
  { name: "HTML", devicon: "devicon-html5-plain colored" },
  { name: "CSS", devicon: "devicon-css3-plain colored" },
  { name: "C", devicon: "devicon-c-plain colored" },
  { name: "C#", devicon: "devicon-csharp-plain colored" },
  { name: "C++", devicon: "devicon-cplusplus-plain colored" },
  { name: "React", svg: langReact },
];

const AboutProgrammingLanguages = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-transparent text-left flex flex-col items-start gap-2">
      <div className="font-semibold inline-block align-bottom text-2xl text-black text-left">
        {t("about_programming_title")}
      </div>
      <hr className="w-full border-t-2 border-black" />
      <div className="flex flex-row flex-wrap gap-[18px] justify-center items-center">
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={lang.name}
            className="w-[38px] h-[38px] flex items-center justify-center"
          >
            {lang.svg ? (
              <img
                src={lang.svg}
                alt={lang.name}
                className="w-[34px] h-[34px]"
              />
            ) : lang.devicon ? (
              <i className={lang.devicon + " text-[34px]"}></i>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutProgrammingLanguages;

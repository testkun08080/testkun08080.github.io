import React from "react";
import toolUe4 from "../assets/tool_ue4.svg";
import toolUnity from "../assets/tool_unity.svg";
import toolMaya from "../assets/tool_maya.svg";
import toolHoudini from "../assets/tool_houdini.svg";
import toolZbrush from "../assets/tool_zbrush.svg";
import toolBlender from "../assets/tool_blender.svg";
import toolPainter from "../assets/tool_painter.svg";
import toolDesigner from "../assets/tool_designer.svg";
import toolDocker from "../assets/tool_docker.svg";
import toolAi from "../assets/tool_ai.svg";
import toolLightroom from "../assets/tool_lightroom.svg";
import toolPs from "../assets/tool_ps.svg";
import toolAe from "../assets/tool_ae.svg";
import toolPr from "../assets/tool_pr.svg";
import toolXd from "../assets/tool_xd.svg";
import toolP4 from "../assets/tool_p4.svg";
import toolGit from "../assets/tool_git.svg";
import toolJenkins from "../assets/tool_jenkins.svg";
import { useTranslation } from "react-i18next";

const tools = [
  { name: "UE4", icon: toolUe4, devicon: "devicon-unrealengine-plain" },
  { name: "Unity", icon: toolUnity, devicon: "devicon-unity-original" },
  { name: "Maya", icon: toolMaya, devicon: "devicon-maya-plain" },
  { name: "Houdini", icon: toolHoudini, devicon: "devicon-houdini-plain" },
  { name: "ZBrush", icon: toolZbrush, devicon: "devicon-zbrush-plain" },
  { name: "Blender", icon: toolBlender, devicon: "devicon-blender-original" },
  { name: "Painter", icon: toolPainter },
  { name: "Designer", icon: toolDesigner },
  { name: "Docker", icon: toolDocker, devicon: "devicon-docker-plain" },
  { name: "Illustrator", icon: toolAi },
  { name: "Lightroom", icon: toolLightroom },
  { name: "Photoshop", icon: toolPs },
  { name: "After Effects", icon: toolAe },
  { name: "Premiere", icon: toolPr },
  { name: "XD", icon: toolXd },
  { name: "Perforce", icon: toolP4 },
  { name: "Git", icon: toolGit, devicon: "devicon-git-plain" },
  { name: "Jenkins", icon: toolJenkins, devicon: "devicon-jenkins-line" },
];

const AboutTools = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-transparent text-left flex flex-col items-start gap-2">
      <div className="font-semibold inline-block align-bottom text-2xl text-black text-left">
        {t("about_tools_title")}
      </div>
      <hr className="w-full border-t-2 border-black" />
      <div className="flex flex-row flex-wrap gap-3 justify-center items-center">
        {tools.map((tool) => (
          <div
            key={tool.name}
            title={tool.name}
            className="w-[38px] h-[38px] flex items-center justify-center"
          >
            {tool.icon ? (
              <img
                src={tool.icon}
                alt={tool.name}
                className="w-[34px] h-[34px]"
              />
            ) : tool.devicon ? (
              <i className={tool.devicon + " colored text-[34px]"}></i>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTools;

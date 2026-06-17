import React from "react";

type IconProps = {
  size?: number;
  className?: string;
};

const LogoIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <img
    src="/logo-trans.svg"
    alt=""
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: "block",
    }}
    className={className}
  />
);

export const menuIconMap: Record<string, React.FC<IconProps>> = {
  home: LogoIcon,
  info: LogoIcon,
  work: LogoIcon,
  skills: LogoIcon,
  contact: LogoIcon,
  others: LogoIcon,
};

export type IconKey = keyof typeof menuIconMap;

export const getMenuIcon = (
  iconKey?: string
): React.FC<IconProps> | undefined => {
  if (!iconKey || !(iconKey in menuIconMap)) return undefined;
  return menuIconMap[iconKey as IconKey];
};

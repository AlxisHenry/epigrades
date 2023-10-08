import React from "react";

export type IconProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  width?: number;
  height?: number;
};

export default function Icon({ icon: Icon, width, height }: IconProps) {
  return <Icon width={width} height={height} />;
}

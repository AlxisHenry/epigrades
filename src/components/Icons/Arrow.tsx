import React from "react";

type Props = {
  width?: number;
  height?: number;
  direction?: string;
};

export default function ArrowIcon({
  width,
  height,
  direction,
}: Props): React.ReactElement {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height ?? "48"}
      viewBox="0 -960 960 960"
      width={width ?? "48"}
    >
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>
  );
}

import React from "react";

import { Icon } from "@/components/icons";

export function Link({ size = 20 }: Icon): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
    >
      <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
    </svg>
  );
}

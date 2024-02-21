import React from "react";
import { Icon } from "./index.js";

export function MenuIcon({ size = 50 }: Icon): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      stroke="#F2F2F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

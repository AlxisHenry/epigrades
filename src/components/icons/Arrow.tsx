import { Icon } from "./index.js";

export function Arrow({ size = 48 }: Icon): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
    >
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>
  );
}

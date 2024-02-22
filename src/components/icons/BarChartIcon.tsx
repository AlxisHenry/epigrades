import { Icon } from "@/components/icons";

export function BarChartIcon({ size = 48 }: Icon): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      fill="none"
      viewBox="0 -960 960 960"
      width={size}
    >
      <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z" />
    </svg>
  );
}

import { Clock } from "react-feather";
import { Icon } from "./Icon";

interface Props {
  title: string;
  date: string;
  inSevenDaysOrLess: boolean;
}

export function Notification({
  title,
  date,
  inSevenDaysOrLess,
}: Props): JSX.Element {
  return (
    <div className={`notification ${inSevenDaysOrLess ? "red" : "green"}`}>
      <div className="notification-icon">
        <Icon icon={Clock} size={32} />
      </div>
      <div className="notification-title">{title}</div>
      <div
        className={`notification-date`}
      >
        {date}
      </div>
    </div>
  );
}

import { BarChart } from "react-feather";
import { Icon } from "./Icon";

interface Props {
  title: string;
  subtitle: string;
  icon?: any;
  iconSize?: number;
}

export function Card({ title, subtitle, icon, iconSize }: Props) {
  return (
    <div className="card">
      <div className="card__content">
        <div>
          <div className="card__subtitle">{subtitle}</div>
          <div className="card__title">{title}</div>
        </div>
        <Icon icon={icon ?? BarChart} size={iconSize ?? 40} />
      </div>
    </div>
  );
}

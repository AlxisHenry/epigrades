interface Props {
  title: string;
  date: string;
  inSevenDays: boolean;
}

export function Notification({ title, date, inSevenDays }: Props): JSX.Element {
  return (
    <div className={`course notification`}>
      <div className="course__header">
        <p>
          {title}
          <span className={`notification-date ${!inSevenDays && "orange"}`}>
            {date}
          </span>
        </p>
        <span className={`soon ${!inSevenDays && "orange"}`}></span>
      </div>
    </div>
  );
}

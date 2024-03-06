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
    <div className={`course notification`}>
      <div className="course__header">
        <p>
          {title}
          <span
            className={`notification-date ${!inSevenDaysOrLess && "orange"}`}
          >
            {date}
          </span>
        </p>
        <span className={`soon ${!inSevenDaysOrLess && "orange"}`}></span>
      </div>
    </div>
  );
}

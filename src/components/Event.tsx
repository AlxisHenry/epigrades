import moment from "moment";

import type { Event as EventType } from "@/services/online";

import { Notification } from "@/components";

interface Props {
  event: EventType;
}

export function Event({ event }: Props): JSX.Element {
  const date = (): string => {
    if (event.is_review)
      return `${moment(event.date).format("DD/MM/YYYY")} ${event.time}`;
    return moment(`${event.date} ${event.time}`).format("DD/MM/YYYY hh:mm A");
  };

  const title = (): string => {
    let title = "";
    if (event.is_review) {
      title = event.title.replace(
        "Meeting",
        `Meeting for ${event.course.name}`
      );
    } else {
      title = `${event.course.name} ${event.title.replace("Project", "")}`;
    }

    let _ = moment(date().split("»")[0].trim(), "DD/MM/YYYY hh:mm A");

    let isPast = _.isBefore(moment());

    if (isPast) return `${title.replace("is due", "")} was ${_.fromNow()}`;

    return `${title} ${_.fromNow()}`;
  };

  return (
    <Notification
      title={title()}
      date={date()}
      inSevenDaysOrLess={
        moment(event.date)
          .startOf("day")
          .diff(moment().startOf("day"), "days") <= 7
      }
    />
  );
}

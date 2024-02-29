import moment from "moment";

import type { Event as EventType } from "@/services/online";

import { Notification } from "@/components";

interface Props {
  event: EventType;
}

export function Event({ event }: Props): JSX.Element {
  let inSevenDays = moment(event.date).diff(moment(), "days") <= 7;

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

    let _ = moment(
      date().split("»")[0].trim().split(" ").slice(0, 2).join(" "),
      "DD/MM/YYYY hh:mm"
    );

    let isPast = _.isBefore(moment());

    if (isPast) {
      return `${title} was ${_.fromNow()}`;
    }

    return `${title} ${_.fromNow()}`;
  };

  return (
    <Notification title={title()} date={date()} inSevenDays={inSevenDays} />
  );
}

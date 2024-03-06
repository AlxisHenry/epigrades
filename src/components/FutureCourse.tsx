import moment from "moment";

import { type FutureCourse as FutureCourseType } from "@/services/online";

import { Notification } from "@/components";

interface Props {
  course: FutureCourseType;
}

export function FutureCourse({ course }: Props): JSX.Element {
  const _ = moment(course.start_date);

  const title = (): string => {
    let isPast = _.isBefore(moment());

    if (isPast) {
      return `${course.title} started ${_.fromNow()}`;
    }

    return `${course.title} starts ${_.fromNow()}`;
  };

  const date = _.format("DD/MM/YYYY hh:mm A");

  return (
    <Notification
      title={title()}
      date={date}
      inSevenDaysOrLess={_.isBefore(moment().add(7, "days"))}
    />
  );
}

import moment from "moment";

import { type FutureCourse as FutureCourseType } from "@/services/online";

import { Notification } from "@/components";

interface Props {
  course: FutureCourseType;
}

export function FutureCourse({ course }: Props): JSX.Element {
  const _ = moment(course.start_date);

  return (
    <Notification
      title={`${course.title} (${course.name}) starts ${_.fromNow()}`}
      date={_.format("DD/MM/YYYY hh:mm A")}
      inSevenDaysOrLess={_.isBefore(moment().add(7, "days"))}
    />
  );
}

import moment from "moment";

import { type FutureCourse as FutureCourseType } from "@/services/online";

interface Props {
  course: FutureCourseType;
}

export function FutureCourse({ course }: Props): JSX.Element {
  let inSevenDays = moment(course.start_date).diff(moment(), "days") <= 7;

  return (
    <div className={`course future-course`}>
      <div className="course__header">
        <p>
          {course.title} starts {moment(course.start_date).fromNow()}{" "}
          <span className={`future-course-date ${!inSevenDays && "orange"}`}>
            {moment(course.start_date).format("DD/MM/YYYY, hh:mm")}
          </span>
        </p>
        <span className={`course__soon ${!inSevenDays && "orange"}`}></span>
      </div>
    </div>
  );
}

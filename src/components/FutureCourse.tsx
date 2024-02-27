import moment from "moment";

import { type FutureCourse as FutureCourseType } from "@/services/courses";

interface Props {
  course: FutureCourseType;
}

export function FutureCourse({ course }: Props): JSX.Element {
  let name = course.title ? `${course.title} (${course.name})` : course.name;

  return (
    <div className={`course future-course`}>
      <div className="course__header">
        {name} starts {moment(course.start_date).fromNow()} (
        {moment(course.start_date).format("DD/MM/YYYY, hh:mm")})
        <span className="course__soon"></span>
      </div>
    </div>
  );
}

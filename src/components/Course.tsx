import "@/styles/components/Course.scss";
import ArrowIcon from "./Icons/Arrow";
import CourseLink from "./CourseLink";
import { type Semester } from "@/services/semesters";
import CourseTable from "./CourseTable";
import { type Course } from "@/services/courses";
import { getCourseGrade, isValidGrade } from "@/services/grades";

type Props = {
  course: Course;
  semester: Semester | null;
  isOpen: boolean;
  toggleDropdown: () => void;
};

export default function Course({
  course,
  semester,
  isOpen,
  toggleDropdown,
}: Props): JSX.Element {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.target instanceof HTMLAnchorElement) return;
    toggleDropdown();
  };

  return (
    <div className={`course ${isOpen ? "course--open" : ""}`}>
      <div className="course__header" onClick={handleClick}>
        <CourseLink
          semester={semester?.name}
          courseName={course.name}
          content={course.name}
          title={true}
        />
        <div className="course__header-left">
          <CourseGradeBadge grade={getCourseGrade(course)} />
          <div className="course__arrow">
            <ArrowIcon />
          </div>
        </div>
      </div>
      <div className="course__days">
        <CourseTable days={course.days} />
        <CourseLink
          semester={semester?.name}
          courseName={course.name}
          content="View Course"
          title={false}
        />
      </div>
    </div>
  );
}

function CourseGradeBadge({ grade }: { grade: string }): JSX.Element {
  if (!isValidGrade(grade)) return (<></>);

  return (
    <span className={`grade-badge grade-badge--${grade}`}>
      {grade}
    </span>
  );
}
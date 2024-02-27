import NextLink from "next/link";
import moment from "moment";

import { type Semester } from "@/services/semesters";
import { type Course } from "@/services/courses";
import { getCourseGrade, isValidGrade } from "@/services/grades";
import { Day as DayType, isValidDay } from "@/services/days";

import { ArrowIcon, LinkArrow } from "@/components/icons";

interface Props {
  isOnline?: boolean;
  uuid?: string;
  course: Course;
  semester: Semester | null;
  isOpen: boolean;
  toggleDropdown: () => void;
}

export function Course({
  isOnline = false,
  uuid,
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
        <Link
          isOnline={isOnline}
          uuid={uuid}
          semester={semester?.name}
          id={course.id}
          content={course.title}
          title={true}
        />
        <div className="course__header-right">
          <Badge grade={getCourseGrade(course)} />
          <div className="course__arrow">
            <ArrowIcon />
          </div>
        </div>
      </div>
      <div className="course__days">
        <Table days={course.days} />
        <Link
          isOnline={isOnline}
          uuid={uuid}
          semester={semester?.name}
          id={course.id}
          content="View Course"
          title={false}
        />
      </div>
    </div>
  );
}

function Badge({ grade }: { grade: string }): JSX.Element {
  if (!isValidGrade(grade)) return <></>;

  return <span className={`grade-badge grade-badge--${grade}`}>{grade}</span>;
}

function Link({
  isOnline = false,
  uuid,
  id,
  semester,
  content,
  title,
}: {
  isOnline?: boolean;
  uuid?: string;
  id: string;
  semester: string | undefined;
  content: string;
  title: boolean;
}) {
  if (!semester) return null;

  const t = (text: string): string => text.toLowerCase();

  const getAs = (): string => {
    return isOnline
      ? `/online/${uuid}/${t(semester)}/${id}`
      : `/semesters/${t(semester)}/${id}`;
  };

  const getLink = (): string => {
    return isOnline
      ? "/online/[uuid]/[semester]/[course]"
      : "/semesters/[semester]/[course]";
  };

  return (
    <NextLink
      className={`course__link ${title ? "course__link--title" : ""}`}
      href={getLink()}
      as={getAs()}
    >
      <div>
        {content} <LinkArrow />
      </div>
      <div className="underline"></div>
    </NextLink>
  );
}

export function Table({ days }: { days: DayType[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Topic</th>
          <th>Assignments</th>
          <th>Due Date</th>
          <th>Submission</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {days.map(
          (day: DayType) => isValidDay(day) && <Day {...day} key={day.name} />
        )}
      </tbody>
    </table>
  );
}

function Day({
  name,
  topic,
  assignments,
  due_date,
  submission,
  grade,
}: DayType) {
  return (
    <tr>
      <td>{name}</td>
      <td>{topic}</td>
      <td>{assignments}</td>
      <td>{moment(due_date).format("DD/MM/YYYY")}</td>
      <td>{submission}</td>
      <td>{grade}</td>
    </tr>
  );
}

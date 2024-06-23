import NextLink from "next/link";
import moment from "moment";

import { getCourseGrade, isValidGrade } from "@/services/grades";
import { isValidDay } from "@/services/days";
import type { Semester, Course, Day as DayType } from "@/services/online";

import { Link as LinkIcon } from "@/components/icons";
import { calculateAverage } from "@/services/courses";

interface Props {
  isOnline?: boolean;
  uuid?: string;
  course: Course;
}

export function Course({
  isOnline = false,
  uuid,
  course,
}: Props): JSX.Element {
  return (
    <div className={`course`} onClick={() => {
      location.href = `/online/${uuid}/${course.id}`;
    }}>
      <Link
        isOnline={isOnline}
        uuid={uuid}
        id={course.id}
        content={course.title || course.name}
        title={true}
      />
      <div className="average">{calculateAverage(course)}<span style={{
        fontSize: "0.8rem",
        marginLeft: "0.5rem",
      }}>/&nbsp;20</span></div>
      <Badge grade={getCourseGrade(course)} />
      <div className="code">
        {course.name}
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
  content,
  title,
}: {
  isOnline?: boolean;
  uuid?: string;
  id: string;
  content: string;
  title: boolean;
}) {
  const t = (text: string): string => text.toLowerCase();

  const getAs = (): string => {
    return isOnline
      ? `/online/${uuid}/${id}`
      : `/semesters/${id}`;
  };

  const getLink = (): string => {
    return isOnline
      ? "/online/[uuid]/[course]"
      : "/semesters/[course]";
  };

  return (
    <NextLink
      className={`course__link ${title ? "course__link--title" : ""}`}
      href={getLink()}
      as={getAs()}
    >
      <div>
        {content} <LinkIcon />
      </div>
      <div className="underline"></div>
    </NextLink>
  );
}

export function Table({ days }: { days: DayType[] }) {
  if (days.length === 0)
    return (
      <tr>
        <td colSpan={6}>This course has no days.</td>
      </tr>
    );

  return (
    <div style={{
      overflowX: "auto",
    }}>
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
          {days.map((day) => isValidDay(day) && <Day day={day} key={day.name} />)}
        </tbody>
      </table>
    </div>
  );
}

function Day({ day }: { day: DayType }) {
  return (
    <tr>
      <td>{day.name}</td>
      <td>{day.topic}</td>
      <td>{day.assignments}</td>
      <td>{moment(day.due_date).format("DD/MM/YYYY")}</td>
      <td>{day.submission}</td>
      <td>{day.grade}</td>
    </tr>
  );
}

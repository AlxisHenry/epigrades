import { type Course, getCourses } from "./courses";

export type Day = {
  name: string;
  topic: string;
  assignments: string;
  due_date: string;
  submission: string;
  grade: string;
};

export function isValidDay(day: Day): boolean {
  return (
    day.name !== "" &&
    day.name !== null &&
    day.due_date !== "-" &&
    day.due_date !== null &&
    day.grade !== null
  );
}

export function isGradedDay(day: Day): boolean {
  return (
    day.due_date !== "-" &&
    day.due_date !== null &&
    day.grade !== null &&
    day.grade !== "-"
  );
}

export function getDays(): Day[] {
  let days: Day[] = [];
  let courses: Course[] = getCourses();
  for (let course of courses) {
    days.push(...course.days);
  }
  return days;
}

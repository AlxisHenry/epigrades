import { type Course, getCourses } from "./courses";

export type Day = {
  name: string;
  topic: string;
  assignments: string;
  due_date: string;
  submission: string;
  grade: string;
};

export function getDays(): Day[] {
  let days: Day[] = [];
  let courses: Course[] = getCourses();
  for (let course of courses) {
    days.push(...course.days);
  }
  return days;
}

import type { Day } from "./days";
import { type Semester, getSemesters } from "./semesters";

export type Course = {
  name: string;
  days: Day[];
};

export function getCourses(): Course[] {
  let courses: Course[] = [];
  let semesters: Semester[] = getSemesters();
  for (let semester of semesters) {
    courses.push(...semester.courses);
  }
  return courses;
}

export function getCoursesNames(): string[] {
  return getCourses().map((c) => c.name);
}

export function getCourse(course: string): Course | null {
  return getCourses().find((c) => c.name === course) || null;
}
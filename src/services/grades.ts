import { type Course } from "./courses";
import { type Day } from "./days";

export enum Grade {
  A = "A", 
  B = "B",
  C = "C",
  D = "D",
  ECHEC = "ECHEC"
}

export function isValidGrade(grade: string): boolean {
  return Object.values(Grade).includes(grade as Grade);
}

export function getCourseGrade(course: Course|null): string {
  if (course === null) return "-";

  let lastDay: Day = course.days[course.days.length - 1];

  if (lastDay.due_date === "-") {
    if (Object.values(Grade).includes(lastDay.grade as Grade)) {
      return lastDay.grade;
    }
  }

  return "-";
}
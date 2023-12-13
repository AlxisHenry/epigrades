import { type Course } from "./courses";
import { type Day } from "./days";
import { Semester, getSemesterCourses } from "./semesters";

export enum Grade {
  A = "A", 
  B = "B",
  C = "C",
  D = "D",
  ECHEC = "ECHEC"
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
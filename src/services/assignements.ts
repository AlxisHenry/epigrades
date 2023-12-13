import { type Course } from "./courses";
import { isGradedDay, isValidDay } from "./days";
import { type Semester } from "./semesters";

export function getSemesterAssignementsCount(
  semester: Semester | null
): number {
  if (semester === null) return 0;
  let count = 0;
  semester.courses.forEach((course) => {
    course.days.map((day) => {
      if (isGradedDay(day)) {
        count++;
      }
    });
  });
  return count;
}

export function getCourseAssignementsCount(course: Course | null): number {
  if (course === null) return 0;
  let count = 0;
  course.days.map((day) => {
    if (isGradedDay(day)) {
      count++;
    }
  });
  return count;
}

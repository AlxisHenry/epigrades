import { type Course } from "@/services/courses";
import { isGradedDay } from "@/services/days";
import { type Semester } from "@/services/semesters";

export function getGlobalAssignementsCount(semesters: Semester[]): number {
  let count = 0;
  semesters.forEach((semester) => {
    semester.courses.forEach((course) => {
      course.days.map((day) => {
        if (isGradedDay(day)) {
          count++;
        }
      });
    });
  });
  return count;
}

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

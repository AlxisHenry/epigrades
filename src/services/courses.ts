import type { Day } from "./days";
import { Grade, getLetterGrade } from "./grades";
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
  return getCourses().find((c) => c.name.toLowerCase() === course) || null;
}

export function calculateCourseGradeAverage(course: Course | null): string {
  if (course === null) return "-";
  let grade = 0,
    countOfGrades = 0;
  course.days.map((day) => {
    if (day.grade !== "-" && day.grade !== null) {
      grade += parseFloat(day.grade);
      countOfGrades++;
    }
  });
  let average = (grade / countOfGrades).toFixed(2);
  return average === "NaN" ? "-" : average;
}

export function getCourseGrade(course: Course | null): string {
  if (course === null) return "-";
  let grade = calculateCourseGradeAverage(course);
  if (grade === "-") return grade;
  return getLetterGrade(parseFloat(grade));
}

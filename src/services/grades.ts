import { type Course } from "./courses";
import { type Day } from "./days";
import { Semester } from "./semesters";

export enum Grade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "Echec",
}

export function isValidGrade(grade: string): boolean {
  return Object.values(Grade).includes(grade as Grade);
}

export function getCourseGrade(course: Course | null): string {
  if (course === null) return "-";

  let lastDay: Day = course.days[course.days.length - 1];

  if (lastDay?.due_date === "-") {
    if (Object.values(Grade).includes(lastDay.grade as Grade)) {
      return lastDay.grade;
    }
  }

  return "-";
}

export function getGradeAverage(semester: Semester): string {
  let grades: string[] = semester.courses
    .map((course) => getCourseGrade(course))
    .filter((grade) => isValidGrade(grade));

  let points: { [key: string]: number } = {
    A: 1,
    B: 0.8,
    C: 0.6,
    D: 0.2,
    Echec: -0.4,
  };

  let total: number = 0;

  for (let grade of grades) {
    total += points[grade];
  }

  let average = total / grades.length,
    closestGrade: string = "",
    closestDifference: number = Infinity;

  for (let grade in points) {
    let difference = Math.abs(average - points[grade]);
    if (difference < closestDifference) {
      closestDifference = difference;
      closestGrade = grade;
    }
  }

  return closestGrade;
}

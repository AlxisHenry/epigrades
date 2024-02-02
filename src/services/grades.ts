import { type Course } from "./courses";
import { type Day } from "./days";
import { Semester } from "./semesters";

export enum Grade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "Echec"
}

export function isValidGrade(grade: string): boolean {
  return Object.values(Grade).includes(grade as Grade);
}

export function getCourseGrade(course: Course | null): string {
  if (course === null) return "-";

  let lastDay: Day = course.days[course.days.length - 1];

  if (lastDay.due_date === "-") {
    if (Object.values(Grade).includes(lastDay.grade as Grade)) {
      return lastDay.grade;
    }
  }

  return "-";
}

export function getMoreRecurentGrade(semester: Semester): string {
  let grades: string[] = semester.courses.map((course) => getCourseGrade(course));
  let gradeCount: { [key: string]: number } = {};

  for (let grade of grades) {
    if (grade !== "-") {
      if (gradeCount[grade]) {
        gradeCount[grade] += 1;
      } else {
        gradeCount[grade] = 1;
      }
    }
  }

  let maxGrade: string = "-";
  let maxCount: number = 0;

  for (let grade in gradeCount) {
    if (gradeCount[grade] > maxCount) {
      maxGrade = grade;
      maxCount = gradeCount[grade];
    }
  }

  return maxGrade;
}
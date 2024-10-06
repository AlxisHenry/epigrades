import type { Course, Day, Report, Semester, Student } from "@/services/online";

export enum Grade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "Echec",
  Echec = "Echec",
}

export const UNKNOW_GRADE = "N/A";

export function isValidGrade(grade: string): boolean {
  return Object.values(Grade).includes(grade as Grade);
}

export function getCreditsFromGrade(grade: string): string {
  if (!isValidGrade(grade)) return UNKNOW_GRADE;
  return grade === Grade.E ? "0" : "5";
}

export function getTotalCredits(semester: Semester): string {
  let credits: string[] = semester.courses
    .map((course) => getCreditsFromGrade(getCourseGrade(course)))
    .filter((credit) => credit !== UNKNOW_GRADE);

  return credits
    .reduce((acc, credit) => (acc += parseInt(credit)), 0)
    .toString();
}

export function getCourseGrade(course: Course | null): string {
  if (course === null) return "-";

  let courseFinalGrade = course.days.find(
    (day) => day.name === "Course final grade"
  );

  if (courseFinalGrade && courseFinalGrade?.grade !== "-") {
    return courseFinalGrade.grade;
  }

  return "N/A";
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

export const getCreditsCount = (report: Report): string => {
  if (!report) return "0";

  return report.semesters
    .map((semester) => {
      return semester.courses
        .filter((course) => isValidGrade(getCourseGrade(course)))
        .map((course) => getCreditsFromGrade(getCourseGrade(course)))
        .reduce((acc, credit) => (acc += parseInt(credit)), 0);
    })
    .reduce((acc, credit) => (acc += credit), 0)
    .toString();
};

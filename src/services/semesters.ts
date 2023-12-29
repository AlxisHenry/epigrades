import grades from "../../scraper/reports/me.json";
import { sortCourses, type Course } from "./courses";
import { isGradedDay } from "./days";

export type Semester = {
  name: string;
  courses: Course[];
  created_at: string | null;
};

function clear(semesters: Semester[]): Semester[] {
  return semesters.filter((s) => s.created_at !== null);
}

export function sortSemesters(semesters: Semester[]): Semester[] {
  return clear(semesters).sort((a, b) => {
    if (a.created_at === null || b.created_at === null) return 0;
    if (a.created_at > b.created_at) return -1;
    if (a.created_at < b.created_at) return 1;
    return 0;
  });
}

export function getSemesters(): Semester[] {
  return clear(grades.semesters);
}

export function getSemester(semester: string): Semester | null {
  return (
    grades.semesters.find(
      (s) => s.name.toLowerCase() === semester.toLowerCase()
    ) || null
  );
}

export function getSemesterCourses(semester: string): Course[] {
  const s: Semester | null = getSemester(semester);
  return sortCourses(s?.courses);
}

export function getSemestersNames(): string[] {
  return getSemesters().map((s) => s.name);
}

export function getSemestersCount(): number {
  return grades.semesters.length;
}

export function calculateSemesterGradeAverage(
  semester: Semester | null
): string {
  if (semester === null) return "-";
  let grade = 0,
    gradesCount = 0;
  semester.courses.forEach((course) => {
    course.days.map((day) => {
      if (isGradedDay(day)) {
        grade += parseFloat(day.grade);
        gradesCount++;
      }
    });
  });
  if (gradesCount === 0) return "-";
  return (grade / gradesCount).toFixed(2);
}

export function calculateGlobalGradeAverage(semesters: Semester[]): string {
  let grade = 0,
    gradesCount = 0;
  semesters.forEach((semester) => {
    semester.courses.forEach((course) => {
      course.days.map((day) => {
        if (isGradedDay(day)) {
          grade += parseFloat(day.grade);
          gradesCount++;
        }
      });
    });
  });
  if (gradesCount === 0) return "-";
  return (grade / gradesCount).toFixed(2);
}

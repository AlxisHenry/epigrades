import grades from "../../scraper/reports/me.json";
import { sortCourses, type Course } from "./courses";
import { isGradedDay } from "./days";

export type Semester = {
  name: string;
  courses: Course[];
};

export function getSemesters(): Semester[] {
  return grades.semesters;
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
  return grades.semesters.map((s) => s.name);
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

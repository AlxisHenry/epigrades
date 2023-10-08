import grades from "./grades.json";
import type { Course } from "./courses";

export type Semester = {
  name: string;
  courses: Course[];
};

export function getSemesters(): Semester[] {
  return grades.semesters;
}

export function getSemester(semester: string): Semester | null {
  return grades.semesters.find((s) => s.name === semester) || null;
}

export function getSemesterCourses(semester: string): Course[] {
  const s: Semester | null = getSemester(semester);
  return s ? s.courses : [];
}

export function getSemesterNames(): string[] {
  return grades.semesters.map((s) => s.name);
}

export function getSemestersCount(): number {
  return grades.semesters.length;
}

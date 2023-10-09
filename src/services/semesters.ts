import grades from "../../bot/grades.json";
import type { Course } from "./courses";

export type Semester = {
  name: string;
  courses: Course[];
};

export function getSemesters(): Semester[] {
  return grades.semesters;
}

export function getSemester(semester: string): Semester | null {
  return grades.semesters.find((s) => s.name === semester.toUpperCase()) || null;
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

export function getSemesterGradeAverage(semesterName: string): number {
  let grade: number = 0,
    countOfGrades: number = 0,
    semester: Semester = getSemester(semesterName) as Semester;
  semester.courses.forEach((course) => {
    course.days.map((day) => {
      if (day.grade !== "-" && day.grade !== null) {
        grade += parseFloat(day.grade);
        countOfGrades++;
      }
    });
  });
  return grade / countOfGrades;
}

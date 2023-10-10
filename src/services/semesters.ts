import grades from "../../bot/grades.json";
import type { Course } from "./courses";
import { getLetterGrade } from "./grades";

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
  return s ? s.courses : [];
}

export function getSemesterNames(): string[] {
  return grades.semesters.map((s) => s.name);
}

export function getSemestersCount(): number {
  return grades.semesters.length;
}

export function getSemesterGrade(semester: Semester | null) {
  if (semester === null) return "-";
  let grade = calculateSemesterGradeAverage(semester);
  if (grade === "-") return grade;
  return getLetterGrade(parseFloat(grade));
}

export function calculateSemesterGradeAverage(
  semester: Semester | null
): string {
  if (semester === null) return "-";
  let grade = 0,
    countOfGrades = 0;
  semester.courses.forEach((course) => {
    course.days.map((day) => {
      if (day.grade !== "-" && day.grade !== null) {
        grade += parseFloat(day.grade);
        countOfGrades++;
      }
    });
  });
  return (grade / countOfGrades).toFixed(2);
}

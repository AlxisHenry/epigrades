import { type Semester } from "./semesters";

export enum Grade {
  "A" = 15,
  "B" = 10,
  "C" = 5,
  "D" = 0,
}

export function getLetterGrade(grade: number): string {
  if (grade >= Grade.A) return "A";
  if (grade >= Grade.B) return "B";
  if (grade >= Grade.C) return "C";
  if (grade >= Grade.D) return "D";
  return "-";
}
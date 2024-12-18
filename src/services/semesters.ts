import { sortCourses } from "@/services/courses";
import { isGradedDay } from "@/services/days";
import { getReport } from "@/services/api";
import type { Course, Semester } from "@/services/online";

export function getSemesters(): Promise<Semester[]> {
  return new Promise(async (resolve, reject) => {
    const response = await getReport();
    resolve(sortSemesters(response.report?.semesters || []));
  });
}

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

export async function getSemester(semester: string): Promise<Semester | null> {
  const semesters = await getSemesters();
  return (
    semesters?.find((s) => s.name.toLowerCase() === semester.toLowerCase()) ||
    null
  );
}

export async function getSemesterCourses(semester: string): Promise<Course[]> {
  const s: Semester | null = await getSemester(semester);
  return sortCourses(s?.courses);
}

export async function getSemestersNames(): Promise<string[]> {
  const semesters = await getSemesters();
  return semesters.map((s) => s.name);
}

export async function getSemestersCount(): Promise<number> {
  const semesters = await getSemesters();
  return semesters.length;
}

export function calculateAverage(
  semester: Semester | Semester[] | null
): string {
  if (semester === null) return "-";

  let sum = 0,
    assignementsCount = 0;

  if (Array.isArray(semester)) {
    semester.forEach((s) => {
      s.courses.forEach((course) => {
        course.days.map((day) => {
          if (isGradedDay(day)) {
            let grade = parseFloat(day.grade) || -1;
            if (grade === -1) return;
            let max = 20;
            if (day.range) {
              let [_, parsedMax] = day.range.split('–').map(parseFloat);
              if (parsedMax !== undefined) max = parsedMax;
            }
            if (max === 0) return;
            if (max !== 20) grade = (grade * 20) / max;
            sum += grade;
            assignementsCount++;
          }
        });
      });
    });
  } else {
    semester.courses.forEach((course) => {
      course.days.map((day) => {
        if (isGradedDay(day)) {
          let grade = parseFloat(day.grade) || -1;
          if (grade === -1) return;
            let max = 20;
            if (day.range) {
            let [_, parsedMax] = day.range.split('–').map(parseFloat);
            if (parsedMax !== undefined) max = parsedMax;
            }
            if (max === 0) return;
            if (max !== 20) grade = (grade * 20) / max;
          sum += grade;
          assignementsCount++;
        }
      });
    });
  }
  if (assignementsCount === 0) return "-";
  return (sum / assignementsCount).toFixed(2);
}

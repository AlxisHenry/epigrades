import { getCourses } from "@/services/courses";
import type { Day, Course } from "@/services/online";

export function isValidDay(day: Day): boolean {
  return (
    day.name !== "" &&
    day.name !== null &&
    day.due_date !== "-" &&
    day.due_date !== null &&
    day.grade !== null
  );
}

export function isGradedDay(day: Day): boolean {
  return (
    day.due_date !== "-" &&
    day.due_date !== null &&
    day.grade !== null &&
    day.grade !== "-"
  );
}

export async function getDays(): Promise<Day[]> {
  let days: Day[] = [];
  let courses: Course[] = await getCourses();
  for (let course of courses) {
    days.push(...course.days);
  }
  return days;
}

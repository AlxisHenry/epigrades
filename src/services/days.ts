import { getCourses } from "@/services/courses";
import type { Day, Course } from "@/services/online";
import { Grade } from "@/services/grades";

export function isValidDay(day: Day): boolean {
  return (
    day.name !== "" &&
    day.name !== null &&
    day.grade !== null &&
    // day is not in Grade enum
    Grade[day.grade as keyof typeof Grade] === undefined
  );
}

export function isGradedDay(day: Day): boolean {
  return day.grade !== null && day.grade !== "-";
}

export async function getDays(): Promise<Day[]> {
  let days: Day[] = [];
  let courses: Course[] = await getCourses();
  for (let course of courses) {
    days.push(...course.days);
  }
  return days;
}

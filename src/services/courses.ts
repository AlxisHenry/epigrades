import moment from "moment";

import { isGradedDay } from "@/services/days";
import { getSemesters } from "@/services/semesters";
import type { Semester, Course, FutureCourse } from "@/services/online";

export function sortCourses(courses: undefined | null | Course[]): Course[] {
  if (!courses) return [];
  return courses.sort((a, b) => {
    if (a.created_at > b.created_at) return -1;
    if (a.created_at < b.created_at) return 1;
    return 0;
  });
}

export function sortFutureCourses(
  courses: undefined | null | FutureCourse[]
): FutureCourse[] {
  if (!courses) return [];
  return courses
    .sort((a, b) => {
      let aDate = new Date(a.start_date),
        bDate = new Date(b.start_date);
      if (aDate > bDate) return 1;
      if (aDate < bDate) return -1;
      return 0;
    })
    .filter(
      (c) =>
        moment(c.start_date).isAfter(moment())
    );
}

export async function getCourses(): Promise<Course[]> {
  let courses: Course[] = [];
  let semesters: Semester[] = await getSemesters();
  for (let semester of semesters) {
    courses.push(...semester.courses);
  }
  return courses;
}

export async function getCoursesNames(): Promise<string[]> {
  let courses: Course[] = await getCourses();
  return courses.map((c) => c.name);
}

export function getCourse(id: string): Promise<Course | null> {
  return new Promise(async (resolve, reject) => {
    let courses = await getCourses();
    resolve(courses.find((c) => c.id === id) || null);
  });
}

export function calculateAverage(course: Course | null): string {
  if (course === null) return "-";
  let grade = 0,
    countOfGrades = 0;
  course.days.map((day) => {
    if (isGradedDay(day)) {
      let g = parseFloat(day.grade) || -1;
      if (g === -1) return;
      let max = 20;
      if (day.range) {
        let [_, parsedMax] = day.range.split('–').map(parseFloat);
        if (parsedMax !== undefined) max = parsedMax;
      }
      console.log(max)
      if (max === 0) return;
      if (max && max !== 20) g = (g * 20) / max;
      grade += g;
      countOfGrades++;
    }
  });
  let average = (grade / countOfGrades).toFixed(2);
  return average === "NaN" ? "-" : average;
}

export function getCourseAssignementsNames(course: Course | null): string[] {
  if (course === null) return [];
  let assignements: string[] = [];
  course.days.map((day) => {
    if (day !== null) {
      assignements.push(day.name);
    }
  });
  return assignements;
}

export function findSemesterByCourseId(
  semesters: Semester[],
  courseId: string
): Semester | null {
  for (let semester of semesters) {
    let course = semester.courses.find((c) => c.id === courseId);
    if (course) return semester;
  }
  return null;
}

export function getCoursesByModules(courses: Course[]): {
  [key: string]: Course[];
} {
  let modules: { [key: string]: Course[] } = {};
  courses.map((course) => {
    let m = course.name.split("-")[1];
    if (!modules[m]) {
      modules[m] = [];
    }
    modules[m].push(course);
  });

  return modules;
}

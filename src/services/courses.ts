import { type Day, isGradedDay } from "./days";
import { type Semester, getSemesters } from "./semesters";

export type Course = {
  id: string;
  name: string;
  days: Day[];
  created_at: string;
};

export function sortCourses(courses: undefined | null | Course[]): Course[] {
  if (!courses) return [];
  return courses.sort((a, b) => {
    if (a.created_at > b.created_at) return -1;
    if (a.created_at < b.created_at) return 1;
    return 0;
  });
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

export function calculateCourseGradeAverage(course: Course | null): string {
  if (course === null) return "-";
  let grade = 0,
    countOfGrades = 0;
  course.days.map((day) => {
    if (isGradedDay(day)) {
      grade += parseFloat(day.grade);
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

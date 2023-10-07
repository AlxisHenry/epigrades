import grades from "./grades.json"
import type { Course } from "./courses"

export type Semester = {
	name: string
	courses: Course[]
}

export function getSemesters(): Semester[] {
	return grades.semesters
}

export function getSemester(semester: string): Semester | undefined {
	return grades.semesters.find(s => s.name === semester)
}

export function getSemesterNames(): string[] {
	return grades.semesters.map(s => s.name)
}
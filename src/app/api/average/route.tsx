import { NextResponse } from 'next/server'
import { Semester, calculateSemesterGradeAverage, getSemesters } from '@/services/semesters'

export async function GET() {
  let average: number = 0;
  const semesters: Semester[] = getSemesters();

  for (const semester of semesters) {
    let currentAverage = parseFloat(calculateSemesterGradeAverage(semester));
    if (currentAverage >= 0) {
      average += currentAverage;
    }
  }

  return NextResponse.json({ 
    average: average
  })
}
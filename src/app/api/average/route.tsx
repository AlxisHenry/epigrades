import { NextRequest, NextResponse } from "next/server";
import {
  Semester,
  calculateSemesterGradeAverage,
  getSemesters,
} from "@/services/semesters";
import { REPORTS_DIR, retrieveGradeWithUUID } from "@/services/online";
import fs from "fs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const uuid: string | null = request.nextUrl.searchParams.get("uuid") || null;
  let average: number = 0;
  let studentSemesters: Semester[] = [];

  if (uuid) {
    try {
      studentSemesters = JSON.parse(
        fs.readFileSync(`${REPORTS_DIR}/${uuid}.json`, "utf8")
      ).semesters;
    } catch (error) {
      return NextResponse.json({
        average: -1,
      });
    }
  } else {
    studentSemesters = getSemesters();
  }

  for (const semester of studentSemesters) {
    let currentAverage = parseFloat(calculateSemesterGradeAverage(semester));
    if (currentAverage >= 0) {
      average += currentAverage;
    }
  }

  return NextResponse.json({
    average: average ?? -1,
  });
}

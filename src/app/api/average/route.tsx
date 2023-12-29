import { NextRequest, NextResponse } from "next/server";
import {
  Semester,
  calculateGlobalGradeAverage,
  calculateSemesterGradeAverage,
  getSemesters,
} from "@/services/semesters";
import { REPORTS_DIR, retrieveGradeWithUUID } from "@/services/online";
import fs from "fs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const uuid: string | null = request.nextUrl.searchParams.get("uuid") || null;
  let semesters: Semester[] = [];

  if (uuid) {
    try {
      semesters = JSON.parse(
        fs.readFileSync(`${REPORTS_DIR}/${uuid}.json`, "utf8")
      ).semesters;
    } catch (error) {
      return NextResponse.json({
        average: -1,
      });
    }
  } else {
    semesters = getSemesters();
  }

  return NextResponse.json({
    average: +calculateGlobalGradeAverage(semesters) ?? -1,
  });
}

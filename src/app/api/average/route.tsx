import { NextRequest, NextResponse } from "next/server";
import {
  Semester,
  calculateGlobalGradeAverage,
  getSemesters,
} from "@/services/semesters";
import { paths } from "@/services/online";
import fs from "fs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const uuid: string | null = request.nextUrl.searchParams.get("uuid") || null;
  let semesters: Semester[] = [];

  if (uuid) {
    try {
      semesters = JSON.parse(
        fs.readFileSync(`${paths.reports}/${uuid}.json`, "utf8")
      ).semesters;
    } catch (error) {
      return NextResponse.json({
        average: -1,
      });
    }
  } else {
    semesters = await getSemesters();
  }

  return NextResponse.json({
    average: +calculateGlobalGradeAverage(semesters) ?? -1,
  });
}

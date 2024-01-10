import { NextRequest, NextResponse } from "next/server";
import {
  Semester,
  calculateGlobalGradeAverage,
  getSemesters,
} from "@/services/semesters";
import { files, paths } from "@/services/online";
import fs from "fs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const uuid: string | null = request.nextUrl.searchParams.get("uuid") || "me";
  let semesters: Semester[] = [];

  let file = files.reports(uuid);
  if (fs.existsSync(file)) {
    let grade = JSON.parse(fs.readFileSync(file, "utf8"));
    semesters = grade.semesters;
  }

  return NextResponse.json({
    average: +calculateGlobalGradeAverage(semesters) || -1,
  });
}

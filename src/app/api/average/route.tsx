import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

import { calculateAverage } from "@/services/semesters";
import { type Semester, type Report, files } from "@/services/online";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const uuid: string | null = request.nextUrl.searchParams.get("uuid") || "me";
  let semesters: Semester[] = [];

  let file = files.reports(uuid);

  if (fs.existsSync(file)) {
    let report: Report = JSON.parse(fs.readFileSync(file, "utf8"));
    semesters = report.semesters;
  }

  return NextResponse.json({
    average: +calculateAverage(semesters) || -1,
  });
}

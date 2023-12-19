import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { Semester } from "@/services/semesters";
import { REPORTS_DIR } from "@/services/online";

export type uuidResponse = {
  success: boolean;
  semesters?: Semester[];
  student?: {
    email: string;
    name: string;
  };
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<uuidResponse>> {
  const uuid: string = request.nextUrl.searchParams.get("uuid") || "";

  let file = `${REPORTS_DIR}/${uuid}.json`;
  if (fs.existsSync(file)) {
    let grade = JSON.parse(fs.readFileSync(file, "utf8"));
    return NextResponse.json({
      success: true,
      semesters: grade.semesters,
      student: grade.student,
    });
  }

  return NextResponse.json({
    success: false,
  });
}

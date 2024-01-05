import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { Semester } from "@/services/semesters";
import { paths } from "@/services/online";

export type uuidResponse = {
  success: boolean;
  semesters?: Semester[];
  student?: {
    email: string;
    name: string;
  };
  created_at?: string | null;
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<uuidResponse>> {
  const uuid: string = request.nextUrl.searchParams.get("uuid") || "";

  let file = `${paths.reports}/${uuid}.json`;
  if (fs.existsSync(file)) {
    let grade = JSON.parse(fs.readFileSync(file, "utf8"));
    return NextResponse.json({
      success: true,
      semesters: grade.semesters,
      student: grade.student,
      created_at: grade.created_at || null,
    });
  }

  return NextResponse.json({
    success: false,
  });
}

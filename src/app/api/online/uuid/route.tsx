import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { Semester } from "@/services/semesters";

export type uuidResponse = {
  success: boolean;
  semesters?: Semester[];
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<uuidResponse>> {
  const uuid: string = request.nextUrl.searchParams.get("uuid") || "";

  let file = `scraper/reports/${uuid}.json`;
  if (fs.existsSync(file)) {
    let semesters = fs.readFileSync(file, "utf8");
    return NextResponse.json({
      success: true,
      ...JSON.parse(semesters),
    });
  }

  return NextResponse.json({
    success: false,
  });
}

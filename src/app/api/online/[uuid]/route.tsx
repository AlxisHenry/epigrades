import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { type Report, paths, type uuidResponse } from "@/services/online";

export async function GET(
  request: NextRequest,
  route: {
    params: {
      uuid: string;
    };
  }
): Promise<NextResponse<uuidResponse>> {
  let file = `${paths.reports}/${route.params.uuid}.json`;

  if (fs.existsSync(file)) {
    let report: Report = JSON.parse(fs.readFileSync(file, "utf8"));
    return NextResponse.json({
      success: true,
      report
    });
  }

  return NextResponse.json({
    success: false,
  });
}

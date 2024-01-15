import { type CacheClearedResponse, files, paths } from "@/services/online";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

export async function POST(
  request: NextRequest
): Promise<NextResponse<CacheClearedResponse>> {
  const { email } = await request.json();

  let uuid = null;
  for (const report of fs.readdirSync(paths.reports)) {
    if (report.includes(".json")) {
      let reportJson = JSON.parse(
        fs.readFileSync(`${paths.reports}/${report}`, "utf8")
      );
      if (reportJson.student.email === email) {
        uuid = report.split(".json")[0];
        break;
      }
    }
  }

  if (!uuid) {
    return NextResponse.json({
      success: false,
    });
  }

  for (const file of files.temp.all(uuid)) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }

  return NextResponse.json({
    success: true,
  });
}

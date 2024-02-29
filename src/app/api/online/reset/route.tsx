import fs from "fs";
import { NextResponse, NextRequest } from "next/server";

import {
  type CacheClearedResponse,
  type Report,
  files,
  paths,
} from "@/services/online";

export async function POST(
  request: NextRequest
): Promise<NextResponse<CacheClearedResponse>> {
  const { email } = await request.json();

  let uuid = null;
  for (const file of fs.readdirSync(paths.reports)) {
    if (file.includes(".json")) {
      let report: Report = JSON.parse(
        fs.readFileSync(`${paths.reports}/${file}`, "utf8")
      );
      if (report.student.email === email) {
        uuid = file.split(".json")[0];
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

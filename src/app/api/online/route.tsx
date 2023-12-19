import {
  NODE_SCRIPT_PATH,
  generateUUID,
  type ScraperResponse,
  REPORTS_DIR,
  PROGRESS_DIR,
} from "@/services/online";
import { exec } from "child_process";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { Credentials } from "@/app/online/page";

export type Progress = {
  currentStep: string;
  progress: number;
  status: number;
};

/**
 * This method will check in the execution file the progress of the execution
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<Progress>> {
  const email: string = request.nextUrl.searchParams.get("email") || "";
  const file = `scraper/progress/${email.split("@")[0]}.json`;

  if (!fs.existsSync(file)) {
    return NextResponse.json({
      currentStep: "Waiting for execution",
      progress: 0,
      status: 0,
    });
  }

  return NextResponse.json(JSON.parse(fs.readFileSync(file, "utf8")));
}

/**
 * This method will check if the credentials are valid and then launch the scraper
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ScraperResponse>> {
  const { email, password }: Credentials = await request.json();

  let uuid = null;

  const files = fs.readdirSync(REPORTS_DIR);
  for (const file of files) {
    if (file.includes(".json")) {
      let report = JSON.parse(
        fs.readFileSync(`${REPORTS_DIR}/${file}`, "utf8")
      );
      if (report.student.email === email) {
        uuid = file.split(".json")[0];
        break;
      }
    }
  }

  if (uuid === null) {
    uuid = generateUUID();
    while (fs.existsSync(`${REPORTS_DIR}/${uuid}.json`)) {
      uuid = generateUUID();
    }
  }

  if (fs.existsSync(`${PROGRESS_DIR}/${email.split("@")[0]}.json`)) {
    return NextResponse.json({
      uuid,
    });
  }

  exec(
    `node ${NODE_SCRIPT_PATH} "${email}" "${password}" ${uuid}`,
    (err, stdout) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    }
  );

  return NextResponse.json({
    uuid,
  });
}

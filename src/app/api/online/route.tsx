import { NODE_SCRIPT_PATH, type ScraperResponse } from "@/services/online";
import { exec } from "child_process";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

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
  const {
    email,
    password,
  }: {
    email: string;
    password: string;
  } = await request.json();

  exec(`ls ./*/*/*/*`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });

  exec(
    `node ${NODE_SCRIPT_PATH} "${email}" "${password}"`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    }
  );

  return NextResponse.json({
    error: null,
  });
}

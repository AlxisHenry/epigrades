import {
  paths,
  generateUUID,
  type ScraperResponse,
  type Credentials,
  files,
  isEpitechEmail,
  authenticateUsingEpitechAPI,
} from "@/services/online";
import { exec } from "child_process";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

export type Progress = {
  currentStep: string;
  progress: number;
  status: number;
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<Progress>> {
  const uuid: string = request.nextUrl.searchParams.get("uuid") || "";
  const file = files.temp.progress(uuid);

  console.log(file);

  if (!fs.existsSync(file)) {
    return NextResponse.json({
      currentStep: "Waiting for execution",
      progress: 0,
      status: 0,
    });
  }

  return NextResponse.json(JSON.parse(fs.readFileSync(file, "utf8")));
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ScraperResponse>> {
  const { email, password }: Credentials = await request.json();

  if (!isEpitechEmail(email)) {
    throw new Error("You must use an Epitech email.");
  }

  const { error } = await authenticateUsingEpitechAPI({ email, password });

  if (error) {
    throw new Error("You provided invalid credentials.");
  }

  let uuid = null;

  for (const file of fs.readdirSync(paths.reports)) {
    if (file.includes(".json")) {
      let report = JSON.parse(
        fs.readFileSync(`${paths.reports}/${file}`, "utf8")
      );
      if (report.student.email === email) {
        uuid = file.split(".json")[0];
        break;
      }
    }
  }

  if (uuid === null) {
    uuid = generateUUID();
    while (fs.existsSync(files.reports(uuid))) {
      uuid = generateUUID();
    }
  }

  if (fs.existsSync(files.reports(uuid))) {
    return NextResponse.json({
      uuid,
    });
  }

  console.log(`node ${files.script} "${email}" "${password}" "${uuid}"`)

  exec(
    `node ${files.script} "${email}" "${password}" "${uuid}"`,
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

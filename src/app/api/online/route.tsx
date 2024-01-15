import {
  paths,
  uuid as uuid,
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

  let currentUuid = null;

  for (const file of fs.readdirSync(paths.reports)) {
    if (file.includes(".json")) {
      let report = JSON.parse(
        fs.readFileSync(`${paths.reports}/${file}`, "utf8")
      );
      if (report.student.email === email) {
        currentUuid = file.split(".json")[0];
        break;
      }
    }
  }

  if (currentUuid === null) {
    currentUuid = uuid();
    while (fs.existsSync(files.reports(currentUuid))) {
      currentUuid = uuid();
    }
  }

  if (fs.existsSync(files.reports(currentUuid))) {
    return NextResponse.json({
      uuid: currentUuid,
    });
  }

  exec(
    `node ${files.script} "${email}" "${password}" ${currentUuid}`,
    (err, stdout) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    }
  );

  return NextResponse.json({
    uuid: currentUuid,
  });
}

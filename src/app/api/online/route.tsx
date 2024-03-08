import fs from "fs";
import { exec } from "child_process";
import { NextResponse, NextRequest } from "next/server";

import {
  type Progress,
  type ScraperResponse,
  type Credentials,
  type Report,
  files,
  isEpitechEmail,
  paths,
  uuid,
  intranetIsOnline,
} from "@/services/online";
import { authenticateUsingEpitechAPI } from "@/services/api";

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

  if (!isEpitechEmail(email)) throw new Error("You must use an Epitech email.");

  const { error } = await authenticateUsingEpitechAPI({ email, password });

  if (error) throw new Error("You provided invalid credentials.");

  let currentUuid = null,
    state = false;

  for (const file of fs.readdirSync(paths.reports)) {
    if (file.includes(".json")) {
      let report: Report = JSON.parse(
        fs.readFileSync(`${paths.reports}/${file}`, "utf8")
      );
      if (report.student.email === email) {
        currentUuid = file.split(".json")[0];
        state = true;
        break;
      }
    }
  }

  const check: boolean = request.nextUrl.searchParams.get("check") === "true";

  if (check) {
    return NextResponse.json({
      state,
      uuid: currentUuid,
    });
  }

  let status = await intranetIsOnline();

  if (!status) throw new Error("The intranet is not reachable.");

  if (currentUuid === null) {
    currentUuid = uuid();
    while (fs.existsSync(files.reports(currentUuid))) {
      currentUuid = uuid();
    }
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
    state,
    uuid: currentUuid,
  });
}

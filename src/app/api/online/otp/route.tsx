import fs from "fs";
import { NextResponse, NextRequest } from "next/server";

import { files } from "@/services/online";

type Response = {
  success: boolean;
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<Response>> {
  const {
    uuid,
    code,
  }: {
    uuid: string;
    code: string;
  } = await request.json();

  fs.writeFileSync(files.temp.otp(uuid), JSON.stringify({ code }));

  return NextResponse.json({
    success: true,
  });
}

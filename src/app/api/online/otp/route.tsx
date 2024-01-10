import { AuthenticateResponse, files, paths } from "@/services/online";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

export async function POST(
  request: NextRequest
): Promise<NextResponse<AuthenticateResponse>> {
  const {
    uuid,
    code,
  }: {
    uuid: string;
    code: string;
  } = await request.json();

  const file = files.temp.otp(uuid);

  if (code.length !== 6) {
    return NextResponse.json({
      success: false,
      error: "Invalid code",
    });
  }

  fs.writeFileSync(file, JSON.stringify({ code }));

  return NextResponse.json({
    success: true,
  });
}

import { AuthenticateResponse, OTP_DIR } from "@/services/online";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

export async function POST(
  request: NextRequest
): Promise<NextResponse<AuthenticateResponse>> {
  const {
    email,
    code,
  }: {
    email: string;
    code: string;
  } = await request.json();

  const file = `${OTP_DIR}/${email.split("@")[0]}.json`;

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

import { AUTHENTICATOR_DIR, OTP_DIR, PROGRESS_DIR } from "@/services/online";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

type Response = {
  success: boolean;
};

export async function POST(request: NextRequest): Promise<NextResponse<Response>> {
  const { email } = await request.json();

  let files = [
    `${PROGRESS_DIR}/${email.split("@")[0]}.json`,
    `${OTP_DIR}/${email.split("@")[0]}.json`
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }

  return NextResponse.json({
    success: true,
  });
}

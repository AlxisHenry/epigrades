import fs from "fs";
import { NextResponse, NextRequest } from "next/server";

import { files } from "@/services/online";

export type AuthenticatorImage = {
  image: string | null;
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<AuthenticatorImage>> {
  const uuid: string = request.nextUrl.searchParams.get("uuid") || "";
  const file = files.temp.authenticator(uuid);

  if (fs.existsSync(file)) {
    return NextResponse.json({
      image: fs.readFileSync(file, "base64"),
    });
  }

  return NextResponse.json({
    image: null,
  });
}

import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { paths } from "@/services/online";

export type AuthenticatorImage = {
  image: string | null;
};

/**
 * This method will check in the execution file the progress of the execution
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<AuthenticatorImage>> {
  const uuid: string = request.nextUrl.searchParams.get("uuid") || "";
  const file = `${paths.authenticator}/${uuid}.png`;

  if (fs.existsSync(file)) {
    return NextResponse.json({
      image: fs.readFileSync(file, "base64"),
    });
  }

  return NextResponse.json({
    image: null,
  });
}

import { Credentials } from "@/app/online/page";
import {
  AuthenticateResponse,
  INVALID_CREDENTIALS_ERROR,
  UNREACHABLE_SERVER_ERROR,
  authenticateUsingEpitechAPI,
  isEpitechEmail,
} from "@/services/online";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest
): Promise<NextResponse<AuthenticateResponse>> {
  const { email, password }: Credentials = await request.json();

  if (!isEpitechEmail(email)) {
    return NextResponse.json({
      error: "You must use an Epitech email.",
      success: false,
    });
  }

  const { error } = await authenticateUsingEpitechAPI({ email, password });

  if (error === INVALID_CREDENTIALS_ERROR) {
    return NextResponse.json({
      error: "You provided invalid credentials.",
      success: false,
    });
  } else if (error === UNREACHABLE_SERVER_ERROR) {
    return NextResponse.json({
      error: UNREACHABLE_SERVER_ERROR,
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
  });
}

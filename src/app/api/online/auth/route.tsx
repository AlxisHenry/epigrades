import { authenticateUsingEpitechAPI } from "@/services/api";
import {
  type Credentials,
  type AuthenticateResponse,
  errors,
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

  if (error === errors.invalidCredentials) {
    return NextResponse.json({
      error: "You provided invalid credentials.",
      success: false,
    });
  } else if (error === errors.unreachableServer) {
    return NextResponse.json({
      error: errors.unreachableServer,
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
  });
}

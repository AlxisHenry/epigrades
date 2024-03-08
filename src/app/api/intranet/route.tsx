import { NextRequest, NextResponse } from "next/server";

import {
  intranetIsOnline,
  type IntranetStatusResponse,
} from "@/services/online";

export async function GET(
  request: NextRequest
): Promise<NextResponse<IntranetStatusResponse>> {
  let status = await intranetIsOnline();

  return NextResponse.json({
    status,
  });
}

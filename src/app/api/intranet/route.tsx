import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";

import { INTRANET_HOSTNAME, IntranetStatusResponse } from "@/services/online";

export async function GET(
  request: NextRequest
): Promise<NextResponse<IntranetStatusResponse>> {
  return new Promise((resolve) => {
    fetch(INTRANET_HOSTNAME)
      .then((response) => {
        console.log(response);
        if ((response.ok, response.status === 200)) {
          resolve(
            NextResponse.json({
              status: true,
            })
          );
        } else {
          resolve(
            NextResponse.json({
              status: false,
            })
          );
        }
      })
      .catch((error) => {
        resolve(
          NextResponse.json({
            status: false,
          })
        );
      });
  });
}

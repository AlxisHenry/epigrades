import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { files } from "@/services/online";

export type EncodedPDFResponse = {
	base64: string;
};

export async function GET(
	request: NextRequest,
	route: {
		params: {
			uuid: string;
		};
	}
): Promise<NextResponse<EncodedPDFResponse>> {
	let { uuid } = route.params;
	let report = fs.readFileSync(files.reports(uuid, true));

	return NextResponse.json({
		base64: `${report.toString("base64")}`,
	});
}

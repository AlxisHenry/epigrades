import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { type Report, files, type EncodedPDFResponse } from "@/services/online";
import PDFDocument from "pdfkit";

const FONTS_DIR = "public/fonts";

const fonts = {
	daytona: {
		regular: `${FONTS_DIR}/DaytonaPro-Regular.ttf`,
		bold: `${FONTS_DIR}/DaytonaPro-Bold.ttf`,
		sm: `${FONTS_DIR}/DaytonaPro-Semibold.ttf`,
	},
};

export const pdf = (uuid: string, grades: Report): Promise<string> => {
	const report = new PDFDocument({
		font: fonts.daytona.regular,
	});

	return new Promise<string>((resolve, reject) => {
		let file = files.temp.report(uuid);
		let pendingStepCount = 2;

		const stepFinished = () => {
			if (--pendingStepCount == 0) {
				resolve(fs.readFileSync(file, "base64"));
				fs.unlinkSync(file);
			}
		};

		const stream = fs.createWriteStream(file);
		stream.on('close', stepFinished);
		report.pipe(stream);

		report
			.fontSize(12)
			.font(fonts.daytona.bold)
			.text("Report", 50, 50);

		for (let semester of grades.semesters) {
			report.
				font(fonts.daytona.sm)
				.text(semester.name, 50, 100);
			for (let course of semester.courses) {
				report
					.font(fonts.daytona.regular)
					.text(course.name);
			}
		}

		report.end();
		stepFinished();
	});
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
	let file = files.reports(uuid);

	if (!fs.existsSync(file)) {
		return NextResponse.json({
			base64: null,
		});
	}

	let report: Report = JSON.parse(fs.readFileSync(file, "utf8"));

	return NextResponse.json({
		base64: await pdf(uuid, report),
	});
}

import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { type Report, files } from "@/services/online";
import PDFDocument from "pdfkit";

export const generateReportPDF = (grades: Report) => {
	const report = new PDFDocument();
	report.pipe(fs.createWriteStream(""));

	report.fontSize(30).text("EPIGRADES", {
		align: "left",
	});

	report.fontSize(25).text("Report", {
		align: "center",
	});
	report.fontSize(15).text("Name: " + grades.student.name, {
		align: "left",
	});

	for (const semester of grades.semesters) {
		report.fontSize(20).text("Semester: " + semester.name, {
			align: "left",
		});
		report.fontSize(15).text("Courses: ", {
			align: "left",
		});
		report.fontSize(15).text(" ", {
			align: "left",
		});

		for (const course of semester.courses) {
			report.fontSize(15).text("Name: " + course.name, {
				align: "left",
			});
		}
	}

	report.end();
};

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
	let report = fs.readFileSync(files.reports(uuid));



	return NextResponse.json({
		base64: `${report.toString("base64")}`,
	});
}

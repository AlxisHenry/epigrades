import PDFDocument from "pdfkit";
import fs from "fs";

export const generateReportPDF = (grades, file) => {
	const report = new PDFDocument();
	report.pipe(fs.createWriteStream(file));

	report.fontSize(25).text("Report", {
		align: "center",
	});
	report.fontSize(15).text("Name: " + grades.student.name, {
		align: "left",
	});

	report.end();
};

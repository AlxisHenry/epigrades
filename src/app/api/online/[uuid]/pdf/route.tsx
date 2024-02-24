import { NextResponse, NextRequest } from "next/server";
import PDFDocument from "pdfkit";
import moment from "moment";
import fs from "fs";

import {
  files,
  type Report,
  type EncodedPDFResponse,
  type Student,
  type SemesterDate,
} from "@/services/online";
import { Course, calculateAverage, sortCourses } from "@/services/courses";
import {
  Semester,
  calculateAverage as calculateSemesterAverage,
  sortSemesters,
} from "@/services/semesters";
import { getCourseGrade, getGradeAverage } from "@/services/grades";

const FONTS_DIR = "public/fonts";

const fonts = {
  daytona: {
    regular: `${FONTS_DIR}/DaytonaPro-Regular.ttf`,
    bold: `${FONTS_DIR}/DaytonaPro-Bold.ttf`,
    sm: `${FONTS_DIR}/DaytonaPro-Semibold.ttf`,
    light: `${FONTS_DIR}/DaytonaPro-Light.ttf`,
    thin: `${FONTS_DIR}/DaytonaPro-Thin.ttf`,
  },
};

const semestersDates: SemesterDate[] = JSON.parse(
  fs.readFileSync(files.semesters, "utf8")
);

const getFilename = (student: Student, isZip: boolean): string => {
  let name = student.name.split(" ").join("-"),
    date = moment().format("DDMMYYYY"),
    ext = isZip ? "zip" : "pdf";
  return `Bulletin-${name}_${date}.${ext}`;
};

const isZip = (base64: string): boolean => base64.startsWith("UEsDBBQAAAAIA");

const formatDate = (date: string): string => moment(date).format("DD/MM/YYYY");

const header = (
  doc: PDFKit.PDFDocument,
  semester: Semester,
  student: Student
) => {
  doc
    .font(fonts.daytona.bold)
    .fontSize(40)
    .text("EPIGRADES", 0, 35, {
      align: "center",
    })
    .moveDown();

  doc
    .font(fonts.daytona.thin)
    .fontSize(14)
    .text(
      `Bulletin de ${student.name} pour le semestre ${semester.name}`,
      0,
      80,
      {
        align: "center",
      }
    )
    .moveDown();

  let { start, end } = semestersDates.find((s) => s.name === semester.name) || {
    start: "",
    end: "",
  };

  doc
    .font(fonts.daytona.thin)
    .fontSize(14)
    .text(`Période du ${formatDate(start)} au ${formatDate(end)}`, 0, 100, {
      align: "center",
    });
};

const footer = (doc: PDFKit.PDFDocument) => {
  doc
    .font(fonts.daytona.thin)
    .fontSize(12)
    .text(
      `Généré par @AlxisHenry - Epigrades - ${moment().format("DD/MM/YYYY")}`,
      0,
      doc.page.height - 40,
      {
        align: "center",
      }
    );
};

const displaySemester = (semester: Semester) => {};

const displayCourse = (course: Course) => {};

const extract = (uuid: string, grades: Report): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    let pendingStepCount = 2;

    const stepFinished = (file: string) => {
      if (--pendingStepCount == 0) {
        resolve(fs.readFileSync(file, "base64"));
        fs.unlinkSync(file);
      }
    };

    let semestersCount = grades.semesters.length;

    let x = 50;

    for (let semester of sortSemesters(grades.semesters)) {
      const file = files.temp.report(uuid, semester.name);

      const report = new PDFDocument({
        font: fonts.daytona.regular,
        margins: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      });

      const stream = fs.createWriteStream(file);
      stream.on("close", stepFinished);
      report.pipe(stream);

      header(report, semester, grades.student);
      footer(report);

      report.font(fonts.daytona.bold).fontSize(16).text(``, x, 120);

      if (!semester.courses.length) continue;

      report.moveDown();
      report.moveDown();

      let currentY = report.y;

      report.font(fonts.daytona.bold).fontSize(16).text("Matière", x, currentY);

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text("Moyenne", x + 225, currentY);

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text("Note", x + 350, currentY);

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text("Crédits", x + 450, currentY);

      report.moveDown();

      for (let course of sortCourses(semester.courses)) {
        let courseAverage = calculateAverage(course),
          grade = getCourseGrade(course);

        if (courseAverage === "-") courseAverage = "N/A";
        if (grade === "-") grade = "N/A";

        let y = report.y;

        report
          .font(fonts.daytona.regular)
          .fontSize(16)
          .text(`${course.name}`, x, y);

        report
          .font(fonts.daytona.light)
          .fontSize(14)
          .text(
            `${courseAverage}`,
            courseAverage === "N/A" ? x + 226 : x + 225,
            y
          );

        report
          .font(fonts.daytona.light)
          .fontSize(14)
          .text(`${grade}`, x + 351, y);

        report
          .font(fonts.daytona.light)
          .fontSize(14)
          .text(`N/A`, x + 451, y);

        report.moveDown();
      }

      report.moveDown();

      let semesterAverage = calculateSemesterAverage(semester);
      currentY = report.y;

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text("Moyenne générale", x, currentY);

      report
        .font(fonts.daytona.sm)
        .fontSize(14)
        .text(`${semesterAverage}`, x + 225, currentY);

      currentY = report.y;

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text("Note moyenne", x, currentY + 10);

      report
        .font(fonts.daytona.sm)
        .fontSize(14)
        .text(getGradeAverage(semester) || "N/A", x + 351, currentY + 10);

      currentY = report.y;

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text(`Crédits accumulés`, x, currentY + 10);

      report
        .font(fonts.daytona.sm)
        .fontSize(14)
        .text(`N/A`, x + 451, currentY + 10);

      report.end();

      if (semestersCount === 0) stepFinished(file);

      semestersCount--;
    }
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
  try {
    let { uuid } = route.params;
    let file = files.reports(uuid);

    if (!fs.existsSync(file)) {
      return NextResponse.json({
        filename: null,
        base64: null,
      });
    }

    let report: Report = JSON.parse(fs.readFileSync(file, "utf8"));
    let base64 = await extract(uuid, report);

    return NextResponse.json({
      filename: getFilename(report.student, isZip(base64)),
      base64,
    });
  } catch (e) {
    return NextResponse.json({
      filename: null,
      base64: null,
    });
  }
}

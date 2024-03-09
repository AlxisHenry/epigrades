import PDFDocument from "pdfkit";
import moment from "moment";
import fs from "fs";
import JSZip from "jszip";
import { NextResponse, NextRequest } from "next/server";

import {
  files,
  type Report,
  type EncodedPDFResponse,
  type Student,
  type SemesterDate,
  type Semester,
} from "@/services/online";
import { calculateAverage, sortCourses } from "@/services/courses";
import {
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

const UNKNOW_GRADE = "N/A";

const semestersDates: SemesterDate[] = JSON.parse(
  fs.readFileSync(files.semesters, "utf8")
);

const getFilename = (
  student: Student,
  isZip: boolean,
  semester: string | null = null
): string => {
  let name = student.name.split(" ").join("-"),
    date = moment().format("DDMMYYYY"),
    ext = isZip ? "zip" : "pdf";
  if (!semester) return `Bulletin-${name}_${date}.${ext}`;
  return `Bulletin-${name}_${semester}_${date}.${ext}`;
};

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

const extract = async (
  uuid: string,
  grades: Report
): Promise<EncodedPDFResponse> => {
  return new Promise<EncodedPDFResponse>((resolve, reject) => {
    const reports: string[] = [];

    let semestersCount = grades.semesters.length;

    const finished = async (): Promise<void> => {
      if (reports.length > 1) {
        const zip = files.temp.zip(uuid);
        const jszip = new JSZip();

        await Promise.all(reports.map(async (report) => {
          let semester = report.split("_")[1].split(".")[0];
          await new Promise<void>((resolve, reject) => {
            fs.readFile(report, (err, data) => {
              if (err) {
                reject(err);
              } else {
                jszip.file(getFilename(grades.student, false, semester), data);
                resolve();
              }
            });
          });
        }));

        jszip
          .generateNodeStream({
            type: "nodebuffer",
            streamFiles: true,
          })
          .pipe(fs.createWriteStream(zip))
          .on("finish", () => {
            let base64 = fs.readFileSync(zip, "base64");

            [...reports, files.temp.zip(uuid)].forEach(
              (report) => fs.existsSync(report) && fs.unlinkSync(report)
            );

            resolve({
              filename: getFilename(grades.student, true),
              base64,
            });
          });
      } else {
        let report = reports[0];

        let semester = report.split("_")[1].split(".")[0],
          base64 = fs.readFileSync(report, "base64");

        fs.existsSync(report) && fs.unlinkSync(report);

        resolve({
          filename: getFilename(grades.student, false, semester),
          base64,
        });
      }
    };

    for (let semester of sortSemesters(grades.semesters)) {
      const file = files.temp.report(uuid, semester.name);

      reports.push(file);

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
      stream.on("close", finished);
      report.pipe(stream);

      let x = 50;

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

        if (courseAverage === "-") courseAverage = UNKNOW_GRADE;
        if (grade === "-") grade = UNKNOW_GRADE;

        if (courseAverage === UNKNOW_GRADE && grade === UNKNOW_GRADE) continue;

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
            courseAverage === UNKNOW_GRADE ? x + 226 : x + 225,
            y
          );

        report
          .font(fonts.daytona.light)
          .fontSize(14)
          .text(`${grade}`, x + 351, y);

        report
          .font(fonts.daytona.light)
          .fontSize(14)
          .text(UNKNOW_GRADE, x + 451, y);

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
        .text(
          getGradeAverage(semester) || UNKNOW_GRADE,
          x + 351,
          currentY + 10
        );

      currentY = report.y;

      report
        .font(fonts.daytona.bold)
        .fontSize(16)
        .text(`Crédits accumulés`, x, currentY + 10);

      report
        .font(fonts.daytona.sm)
        .fontSize(14)
        .text(UNKNOW_GRADE, x + 451, currentY + 10);

      report.end();

      if (semestersCount === 0) finished();

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
  const empty = {
    filename: null,
    base64: null,
  };

  try {
    let { uuid } = route.params;
    let file = files.reports(uuid);

    if (!fs.existsSync(file)) {
      return NextResponse.json(empty);
    }

    return NextResponse.json(
      await extract(uuid, JSON.parse(fs.readFileSync(file, "utf8")))
    );
  } catch (e) {
    return NextResponse.json(empty);
  }
}

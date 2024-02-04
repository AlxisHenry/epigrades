import fs from "fs";
import puppeteer from "puppeteer";
import Jimp from "jimp";

const startTime = Date.now();

const email = process.argv[2];
const password = process.argv[3];
const uuid = process.argv[4];

if (!email || !password || !uuid) {
  console.error("Missing arguments (email, password or uuid).");
  process.exit(1);
}

const TEMP_DIR = "scraper/temp";
const WAITING_FOR_AUTHENTICATION_TIMEOUT = 63000;
const files = {
  progress: `${TEMP_DIR}/progress-${uuid}.json`,
  otp: `${TEMP_DIR}/otp-${uuid}.json`,
  authenticator: `${TEMP_DIR}/authenticator-${uuid}.png`,
  report: `scraper/reports/${uuid}.json`,
  pdf: `scraper/reports/${uuid}.pdf`,
};

if (fs.existsSync(files.progress)) {
  process.exit(0);
}

const ASSIGNEMENTS_URL =
  "https://gandalf.epitech.eu/mod/assign/index.php?id=[id]";

const semestersDates = [
  {
    name: "T5",
    start: "2023-09-12",
    end: "2024-02-12",
  },
  {
    name: "T6",
    start: "2024-02-12",
    end: "2024-08-12",
  },
  {
    name: "T7",
    start: "2024-08-12",
    end: "2025-02-12",
  },
  {
    name: "T8",
    start: "2025-02-12",
    end: "2025-08-12",
  },
  {
    name: "T9",
    start: "2025-08-12",
    end: "2026-02-12",
  },
  {
    name: "T10",
    start: "2026-02-12",
    end: "2026-08-12",
  },
];

const cleanFiles = () => {
  if (fs.existsSync(files.otp)) {
    fs.unlinkSync(files.otp);
  }
  if (fs.existsSync(files.progress)) {
    fs.unlinkSync(files.progress);
  }
  if (fs.existsSync(files.authenticator)) {
    fs.unlinkSync(files.authenticator);
  }
};

const formatDueDate = (due_date) => {
  if (due_date === "-") return due_date;

  let parsedDate = new Date(due_date);

  if (!isNaN(parsedDate)) {
    const year = parsedDate.getFullYear();
    const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
    const day = `0${parsedDate.getDate()}`.slice(-2);
    const hours = `0${parsedDate.getHours()}`.slice(-2);
    const minutes = `0${parsedDate.getMinutes()}`.slice(-2);
    const seconds = `0${parsedDate.getSeconds()}`.slice(-2);
    parsedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return parsedDate;
};

const write = (currentStep, progress, status = 0) => {
  fs.writeFileSync(
    files.progress,
    JSON.stringify({
      currentStep,
      progress: Math.round(progress),
      status,
    }),
    "utf8"
  );
};

const now = () => {
  const fullDate = new Date(Date.now())
    .toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })
    .toString();
  let [date, time] = fullDate.replace(" AM", "").split(" ");
  let [day, month, year] = date.split("/");
  let [hours, minutes, seconds] = time.split(":");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getStudentName = (email) => {
  let parts = email.split("@")[0].split(".");
  return `${parts[1].toUpperCase()} ${parts[0]
    .charAt(0)
    .toUpperCase()}${parts[0].slice(1)}`;
};

const getDuration = () => {
  const duration = parseInt((Date.now() - startTime) / 1000);
  if (duration > 60) {
    return `${parseInt(duration / 60)}m${duration % 60}s`;
  } else if (duration === 60) {
    return "1m";
  }

  return duration + "s";
};

const exit = (browser) => {
  setTimeout(async () => {
    await browser.close();
    cleanFiles();
    process.exit(0);
  }, 2000);
};

cleanFiles();

(async () => {
  write("Launching the browser", 0);
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: ["--disable-features=site-per-process", "--window-size=1280,1080"],
  });
  const page = await browser.newPage();
  await page.goto("https://gandalf.epitech.eu/login/index.php");
  write("Opening the intranet login page", 2);

  await page.waitForXPath(
    "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a"
  );
  const microsoftLoginButton = await page.$x(
    "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a"
  );
  await microsoftLoginButton[0].click();

  write("Identifying the authentication method used", 5);

  await page.waitForNavigation();

  await page.waitForXPath('//*[@id="i0116"]');
  const emailInput = await page.$x('//*[@id="i0116"]');
  await emailInput[0].type(email);

  await page.waitForXPath('//*[@id="idSIButton9"]');
  const nextButton = await page.$x('//*[@id="idSIButton9"]');
  await nextButton[0].click();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const hasBrowserError = await page.$x('//*[@id="debugging"]');
    if (hasBrowserError.length > 0) {
      write("Authentication failed", 5, 1);
      exit(browser);
    }
  } catch (e) { }

  try {
    await page.waitForXPath('//*[@id="passwordInput"]', {
      timeout: 5000,
    });
    const passwordInput = await page.$x('//*[@id="passwordInput"]');
    await passwordInput[0].type(password);
    await page.waitForXPath('//*[@id="submitButton"]');
    const submitButton = await page.$x('//*[@id="submitButton"]');
    await submitButton[0].click();
  } catch (e) { }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const useSms = await page.$x('//*[@id="idDiv_SAOTCS_Proofs"]/div[1]/div/div');

  if (useSms.length > 0) {
    await useSms[0].click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.waitForXPath('//*[@id="idDiv_SAOTCC_Description"]');
    let phone = await page.$x('//*[@id="idDiv_SAOTCC_Description"]');
    phone = await page.evaluate((el) => el.textContent, phone[0]);
    phone = phone.replace(/\s/g, "").split("+")[1].split(".")[0];
    write("Waiting for 2FA code sent to " + phone, 10);

    while (!fs.existsSync(files.otp)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let code = JSON.parse(fs.readFileSync(files.otp, "utf8")).code;
    await page.waitForXPath(
      "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[3]/div/div[3]/div/input"
    );
    const codeInput = await page.$x(
      "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[3]/div/div[3]/div/input"
    );

    if (code.length !== 6 || isNaN(code)) {
      code = "000000";
    }

    await codeInput[0].type(code);

    await page.waitForXPath(
      "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[6]/div/div/div/div/input"
    );
    const submitCodeButton = await page.$x(
      "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[6]/div/div/div/div/input"
    );
    await submitCodeButton[0].click();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const errorSendingCode = await page.$x(
      '//*[@id="idDiv_SAOTCC_ErrorMsg_OTC"]'
    );

    if (errorSendingCode.length > 0) {
      write("Authentication failed", 10, 1);
      await browser.close();
      process.exit(0);
    }
  } else {
    write("Retrieving the code needed for the authentication", 10);
    await page.screenshot({ path: files.authenticator });
    const image = await Jimp.read(files.authenticator);
    const { width, height } = image.bitmap;
    const cropWidth = 50;
    const cropHeight = 38;
    const cropX = width / 2 - cropWidth / 2;
    const cropY = height / 2 - cropHeight / 2 - 22;
    image.crop(cropX, cropY, cropWidth, cropHeight);
    await image.writeAsync(files.authenticator);
    write("Waiting for Microsoft Authenticator validation", 10);
  }

  try {
    await page.waitForXPath(
      "/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input",
      {
        timeout: WAITING_FOR_AUTHENTICATION_TIMEOUT,
      }
    );
  } catch (e) {
    write("Authentication failed", 10, 1);
    exit(browser);
  }

  const continueButton = await page.$x(
    "/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input"
  );
  await continueButton[0].click();

  await page.waitForNavigation();

  write("Logged successfully to the intranet", 15);

  await page.waitForXPath(
    "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[4]/ul"
  );

  const list = await page.$x(
    "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[4]/ul"
  );

  const courses = await list[0]?.$$("li");
  const coursesCount = courses.length;

  write("Starting to retrieve your graded courses", 20);

  let grades = {
    student: {
      email,
      name: getStudentName(email),
    },
    semesters: [],
    created_at: null,
  };

  for (let i = 0; i < coursesCount; i++) {
    const course = courses[i];
    const element = await course.$("a");
    const link = await page.evaluate((el) => el.href, element);
    const name = await page.evaluate((el) => el.textContent, element);
    const coursePage = await browser.newPage();
    await coursePage.goto(ASSIGNEMENTS_URL.replace("[id]", link.split("=")[1]));

    write(`${name} (${i + 1}/${coursesCount})`, 20 + (i / coursesCount) * 70);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const courseNotAvailable = await coursePage.$x(
      "/html/body/div[4]/div/div[2]/section/div/div[1]"
    );

    if (!(courseNotAvailable.length > 0)) {
      const semester = await coursePage.$x(
        "/html/body/div[5]/div[1]/div[1]/div/nav/ol/li[4]/span/a/span"
      );
      let semesterName = await coursePage.evaluate(
        (el) => el?.textContent ?? null,
        semester[0]
      );

      if (semesterName === null) {
        for (const semesterDate of semestersDates) {
          if (
            new Date(semesterDate.start) <= new Date() &&
            new Date(semesterDate.end) >= new Date()
          ) {
            semesterName = semesterDate.name;
            break;
          }
        }
      }

      if (semesterName === null) {
        semesterName = "-";
      }

      const table = await coursePage.$x(
        "/html/body/div[5]/div[1]/div[2]/section/div/table"
      );
      const tableRows = await table[0]?.$$("tr");
      const tableRowsCount = tableRows.length;

      if (!grades.semesters.find((s) => s.name === semesterName)) {
        grades.semesters.push({
          name: semesterName,
          courses: [],
          created_at: null,
        });
      }

      for (let i = 1; i < tableRowsCount; i++) {
        const row = tableRows[i];
        const rowColumns = await row?.$$("td");
        if (rowColumns.length <= 0) continue;
        const topic = await coursePage.evaluate(
          (el) => el?.textContent ?? "",
          rowColumns[0]
        );
        const assignments = await coursePage.evaluate(
          (el) => el?.textContent ?? "",
          rowColumns[1]
        );
        const due_date = await coursePage.evaluate(
          (el) => el?.textContent ?? "",
          rowColumns[2]
        );
        const submission = await coursePage.evaluate(
          (el) => el?.textContent ?? "",
          rowColumns[3]
        );
        const grade = await coursePage.evaluate(
          (el) => el?.textContent ?? "",
          rowColumns[4]
        );
        if (!topic && !assignments && !due_date && !submission && !grade)
          continue;

        if (
          !grades.semesters
            .find((s) => s.name === semesterName)
            .courses.find((c) => c.name === name)
        ) {
          grades.semesters
            .find((s) => s.name === semesterName)
            .courses.push({
              id: link.split("=")[1],
              name: name,
              days: [],
              created_at: null,
            });
        }

        grades.semesters
          .find((s) => s.name === semesterName)
          .courses.find((c) => c.name === name)
          .days.push({
            name: topic,
            topic,
            assignments,
            due_date: formatDueDate(due_date),
            submission,
            grade,
          });
      }

      if (grades && grades.semesters) {
        const semester = grades.semesters.find((s) => s.name === semesterName);
        const course = semester?.courses.find((c) => c.name === name);
        const lastGrade = course?.days
          .slice()
          .reverse()
          .find((day) => day.due_date !== "-");
        const firstGrade = course?.days.find((day) => day.due_date !== "-");

        if (firstGrade && new Date(firstGrade.due_date) > new Date()) {
          semester.courses = semester.courses.filter(
            (c) => c.name !== course.name
          );
        }

        if (lastGrade) {
          course.created_at = lastGrade.due_date;
        }
      }
    }

    await coursePage.close();
  }

  // TODO: Retrieve badges
  // TODO: Retrieve GPA

  write("Generating the report", 95);

  grades.semesters = grades.semesters.filter((s) => s.courses.length > 0);

  for (const semester of grades.semesters) {
    semester.created_at = semester?.courses[0]?.created_at ?? null;
  }

  grades.created_at = now();
  fs.writeFileSync(files.report, JSON.stringify(grades), "utf8");

  write(`All tasks done (in ${getDuration()}) 🚀`, 100);
  exit(browser);
})();

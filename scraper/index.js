import fs from "fs";
import puppeteer from "puppeteer";
import Jimp from "jimp";

const email = process.argv[2];
const password = process.argv[3];
const uuid = process.argv[4];

if (!email || !password || !uuid) {
  console.error("Missing arguments (email, password or uuid).");
  process.exit(1);
}

const AUTHENTICATOR_FILE = `scraper/authenticator/${uuid}.png`;
const otpCodeFile = `scraper/otp/${email.split("@")[0]}.json`;
const progressFile = `scraper/progress/${email.split("@")[0]}.json`;
const reportFile = `scraper/reports/${uuid}.json`;
const ASSIGNEMENTS_URL =
  "https://gandalf.epitech.eu/mod/assign/index.php?id=[id]";

const cleanFiles = () => {
  if (fs.existsSync(otpCodeFile)) {
    fs.unlinkSync(otpCodeFile);
  }
  if (fs.existsSync(progressFile)) {
    fs.unlinkSync(progressFile);
  }
  if (fs.existsSync(AUTHENTICATOR_FILE)) {
    fs.unlinkSync(AUTHENTICATOR_FILE);
  }
};

const formatDueDate = (due_date) => {
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
    progressFile,
    JSON.stringify({ currentStep, progress, status }),
    "utf8"
  );
};

const now = () => {
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return formattedDate;
};

const getStudentName = (email) => {
  let parts = email.split("@")[0].split(".");
  return parts
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
};

cleanFiles();

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: ["--disable-features=site-per-process", "--window-size=1280,1080"],
  });
  const page = await browser.newPage();
  await page.goto("https://gandalf.epitech.eu/login/index.php");
  write("Opening Gandalf", 0);

  await page.waitForXPath(
    "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a"
  );
  const microsoftLoginButton = await page.$x(
    "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a"
  );
  await microsoftLoginButton[0].click();

  write("Starting authentication with Microsoft", 5);

  await page.waitForNavigation();

  await page.waitForXPath('//*[@id="i0116"]');
  const emailInput = await page.$x('//*[@id="i0116"]');
  await emailInput[0].type(email);

  await page.waitForXPath('//*[@id="idSIButton9"]');
  const nextButton = await page.$x('//*[@id="idSIButton9"]');
  await nextButton[0].click();

  try {
    await page.waitForXPath('//*[@id="passwordInput"]', {
      timeout: 5000,
    });
    const passwordInput = await page.$x('//*[@id="passwordInput"]');
    await passwordInput[0].type(password);
    await page.waitForXPath('//*[@id="submitButton"]');
    const submitButton = await page.$x('//*[@id="submitButton"]');
    await submitButton[0].click();
  } catch (e) {}

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

    while (!fs.existsSync(otpCodeFile)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const code = JSON.parse(fs.readFileSync(otpCodeFile, "utf8")).code;
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

    write("The code has been correctly submitted", 15);
  } else {
    // Make a screenshot of the code and crop it to get only the code
    await page.screenshot({ path: AUTHENTICATOR_FILE });
    const image = await Jimp.read(AUTHENTICATOR_FILE);
    const { width, height } = image.bitmap;
    const cropWidth = 50;
    const cropHeight = 40;
    const cropX = width / 2 - cropWidth / 2;
    const cropY = height / 2 - cropHeight / 2 - 22;
    image.crop(cropX, cropY, cropWidth, cropHeight);
    await image.writeAsync(AUTHENTICATOR_FILE);
    write("Waiting for validation on the Authenticator app", 5);
  }

  await page.waitForXPath(
    "/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input",
    {
      timeout: 30000,
    }
  );

  const continueButton = await page.$x(
    "/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input"
  );
  await continueButton[0].click();

  await page.waitForNavigation();

  write("Successfully logged on the intranet", 20);

  await page.waitForXPath(
    "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[4]/ul"
  );

  const list = await page.$x(
    "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[4]/ul"
  );

  const courses = await list[0].$$("li");
  const coursesCount = courses.length;

  write("Starting the assignements retrieval", 25);

  let grades = {
    student: {
      email,
      name: getStudentName(email),
    },
    semesters: [],
  };

  for (let i = 0; i < coursesCount; i++) {
    let currentProgress = 25 + (i / coursesCount) * 75;
    const course = courses[i];
    const element = await course.$("a");
    const link = await page.evaluate((el) => el.href, element);
    const name = await page.evaluate((el) => el.textContent, element);
    const coursePage = await browser.newPage();
    await coursePage.goto(ASSIGNEMENTS_URL.replace("[id]", link.split("=")[1]));
    write(`Retrieving ${name} - ${i + 1}/${coursesCount}`, currentProgress);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const courseNotAvailable = await coursePage.$x(
      "/html/body/div[4]/div/div[2]/section/div/div[1]"
    );

    if (!(courseNotAvailable.length > 0)) {
      const semester = await coursePage.$x(
        "/html/body/div[5]/div[1]/div[1]/div/nav/ol/li[4]/span/a/span"
      );
      const semesterName = await coursePage.evaluate(
        (el) => el?.textContent ?? "T5",
        semester[0]
      );
      const table = await coursePage.$x(
        "/html/body/div[5]/div[1]/div[2]/section/div/table"
      );
      const tableRows = await table[0].$$("tr");
      const tableRowsCount = tableRows.length;

      if (!grades.semesters.find((s) => s.name === semesterName)) {
        grades.semesters.push({
          name: semesterName,
          courses: [],
        });
      }

      for (let i = 1; i < tableRowsCount; i++) {
        const row = tableRows[i];
        const rowColumns = await row.$$("td");
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
              name: name,
              days: [],
              created_at: now(),
            });
        }

        grades.semesters
          .find((s) => s.name === semesterName)
          .courses.find((c) => c.name === name)
          .days.push({
            name: topic,
            topic,
            assignments,
            due_date: due_date === "-" ? "-" : formatDueDate(due_date),
            submission,
            grade,
          });
      }

      if (grades && grades.semesters) {
        const semester = grades.semesters.find((s) => s.name === semesterName);
        if (semester) {
          const course = semester.courses.find((c) => c.name === name);
          if (course) {
            const lastGrade = course.days[course.days.length - 1];
            if (lastGrade) {
              course.created_at = lastGrade.due_date;
            }
          }
        }
      }
    }

    await coursePage.close();
  }

  write("Generating the report", 100, 1);

  fs.writeFileSync(reportFile, JSON.stringify(grades), "utf8");

  setTimeout(async () => {
    await browser.close();
    cleanFiles();
    process.exit(0);
  }, 1000);
})();

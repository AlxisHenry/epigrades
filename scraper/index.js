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
  semesters: "scraper/semesters.json",
};

if (fs.existsSync(files.progress)) {
  process.exit(0);
}

const DEFAULT_SEMESTER_NAME = "-";
const urls = {
  home: "https://gandalf.epitech.eu/",
  assignments: "https://gandalf.epitech.eu/mod/assign/index.php?id=[id]",
  course: "https://gandalf.epitech.eu/course/view.php?id=[id]",
  graph: "https://gandalf.epitech.eu/local/graph/view.php",
};
const semestersDates = JSON.parse(fs.readFileSync(files.semesters, "utf8"));

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

const formatCourseTitle = (title) => {
  const words = title.split(" ");
  let formattedTitle = "";

  for (let i = 0; i < words.length; i++) {
    formattedTitle += words[i].charAt(0) + words[i].slice(1).toLowerCase();
    if (i < words.length - 1) formattedTitle += " ";
  }

  return formattedTitle;
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
  return `${date.split("/").join("-")} ${time}`;
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

const trim = (str) => str.replace("\n", "").trim();

cleanFiles();

(async () => {
  write("Launching the browser", 0);
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: ["--disable-features=site-per-process", "--window-size=1280,1080"],
  });
  write("Opening the intranet login page", 2);

  const page = await browser.newPage();

  try {
    await page.goto("https://gandalf.epitech.eu/login/index.php");

    await page.waitForXPath(
      "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a",
      {
        timeout: 5000,
      }
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
  } catch (e) {
    write("Authentication failed", 5, 1);
    exit(browser);
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const hasBrowserError = await page.$x('//*[@id="debugging"]');
    if (hasBrowserError.length > 0) {
      write("Authentication failed", 5, 1);
      exit(browser);
    }
  } catch (e) {}

  try {
    await page.waitForXPath('//*[@id="i0118"]', {
      timeout: 5000,
    });
    const passwordInput = await page.$x('//*[@id="i0118"]');
    await passwordInput[0].type(password);
    await page.waitForXPath('//*[@id="idSIButton9"]');
    const submitButton = await page.$x('//*[@id="idSIButton9"]');
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
    "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[2]/ul"
  );

  const list = await page.$x(
    "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[2]/ul"
  );

  const courses = await list[0]?.$$("li");
  const coursesCount = courses.length;

  write("Starting to retrieve your graded courses", 20);

  let grades = {
    student: {
      email,
      name: getStudentName(email),
      promotion: "",
      campus: "",
    },
    semesters: [
      {
        name: DEFAULT_SEMESTER_NAME,
        courses: [],
        created_at: null,
      },
    ],
    future_courses: [],
    upcoming_events: [],
    created_at: null,
  };

  for (let i = 0; i < coursesCount; i++) {
    const course = courses[i];
    const element = await course.$("a");
    const link = await page.evaluate((el) => el.href, element);
    const name = await page.evaluate((el) => el.textContent, element);
    const currentPage = await browser.newPage();

    await currentPage.goto(
      urls.assignments.replace("[id]", link.split("=")[1])
    );

    write(`${name} (${i + 1}/${coursesCount})`, 20 + (i / coursesCount) * 70);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const courseNotAvailable = await currentPage.$x(
      "/html/body/div[4]/div/div[2]/section/div/div[1]"
    );

    if (!(courseNotAvailable.length > 0)) {
      const titleContainer = await currentPage.$x(
        "/html/body/div[4]/header/div[2]/div/div[1]/div/div[2]/h1"
      );

      let title = null;

      try {
        title = await currentPage.evaluate(
          (el) => el.textContent,
          titleContainer[0]
        );
      } catch (e) {}

      grades.semesters
        .find((semester) => semester.name === DEFAULT_SEMESTER_NAME)
        .courses.push({
          id: link.split("=")[1],
          name: name,
          title,
          team: null,
          days: [],
          events: [],
          members: [],
          created_at: null,
        });

      const table = await currentPage.$$(".generaltable");
      const rows = await table[0]?.$$("tr");

      if (!rows) {
        await currentPage.close();
        continue;
      }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const columns = await row?.$$("td");

        if (columns.length <= 0) continue;

        const topic = await currentPage.evaluate(
          (el) => el?.textContent ?? "",
          columns[0]
        );
        const assignments = await currentPage.evaluate(
          (el) => el?.textContent ?? "",
          columns[1]
        );
        const due_date = await currentPage.evaluate(
          (el) => el?.textContent ?? "",
          columns[2]
        );
        const submission = await currentPage.evaluate(
          (el) => el?.textContent ?? "",
          columns[3]
        );
        const grade = await currentPage.evaluate(
          (el) => el?.textContent ?? "",
          columns[4]
        );

        if (!topic && !assignments && !due_date && !submission && !grade)
          continue;

        grades.semesters
          ?.find((semester) => semester.name === DEFAULT_SEMESTER_NAME)
          ?.courses?.find((c) => c.name === name)
          ?.days.push({
            name: topic,
            topic,
            assignments,
            due_date: formatDueDate(due_date),
            submission,
            grade,
          });
      }
    }

    await currentPage.close();
  }

  const courseOverviewFilter = await page.$x(
    "/html/body/div[5]/div[1]/div/section/div/aside/div[2]/div[2]/div/div[1]/div[1]/button"
  );

  if (courseOverviewFilter.length > 0) {
    await courseOverviewFilter[0].click();

    const futureFilter = await page.$x(
      "/html/body/div[5]/div[1]/div/section/div/aside/div[2]/div[2]/div/div[1]/div[1]/ul/li[5]"
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (futureFilter.length > 0) {
      write("Retrieving future courses", 90);

      const futureCourses = [];

      await futureFilter[0].click();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const futureCoursesContainer = await page.$x(
        "/html/body/div[5]/div[1]/div/section/div/aside/div[2]/div[2]/div/div[2]/div/div/div[1]/div/div"
      );

      const futureCoursesCards = await futureCoursesContainer[0]?.$$("div");

      for (let i = 0; i < futureCoursesCards.length; i++) {
        const courseBody = await futureCoursesCards[i]?.$(
          ".course-info-container"
        );

        if (!courseBody) continue;

        const id = await page.evaluate(
          (el) => el.getAttribute("data-course-id"),
          futureCoursesCards[i]
        );

        if (!id) continue;

        const nameContainer = await courseBody.$$(
          ".text-muted > div:last-child"
        );

        if (!nameContainer) continue;

        const name = await page.evaluate(
          (el) => el.textContent,
          nameContainer[0]
        );

        if (!name) continue;

        if (!futureCourses.find((c) => c.id === id))
          futureCourses.push({
            id,
            name: trim(name),
          });
      }

      for (let i = 0; i < futureCourses.length; i++) {
        const currentPage = await browser.newPage();

        const { id, name } = futureCourses[i];

        await currentPage.goto(urls.course.replace("[id]", id));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const isRestricted = await currentPage.$$(".isrestricted");

        if (isRestricted.length > 0) {
          const startDate = await currentPage.evaluate(
            (el) => el.textContent,
            isRestricted[0]
          );

          const courseTitleContainer = await currentPage.$x(
            "/html/body/div[4]/header/div[2]/div/div[1]/div/div[2]/h1"
          );

          const courseTitle = await currentPage.evaluate(
            (el) => el.textContent,
            courseTitleContainer[0]
          );

          grades.future_courses.push({
            id: id,
            name: name,
            title: formatCourseTitle(courseTitle) ?? null,
            start_date: startDate.split("from")[1].trim(),
          });
        }

        await currentPage.close();
      }
    }
  }

  write("Retrieving upcoming events", 95);

  let events_url = "https://gandalf.epitech.eu/calendar/view.php?view=upcoming";

  await page.goto(events_url);

  await page.waitForXPath(
    "/html/body/div[5]/div[1]/div[2]/section/div/div/div[1]/div/div[2]/div"
  );

  const eventList = await page.$x(
    "/html/body/div[5]/div[1]/div[2]/section/div/div/div[1]/div/div[2]/div"
  );

  if (eventList.length > 0) {
    const events = await eventList[0]?.$$("div.event");

    for (let i = 0; i < events.length; i++) {
      const currentEvent = events[i];

      if (!currentEvent) continue;

      const title = await page.evaluate(
        (el) => el.getAttribute("data-event-title"),
        currentEvent
      );

      const courseId = await page.evaluate(
        (el) => el.getAttribute("data-course-id"),
        currentEvent
      );

      const id = await page.evaluate(
        (el) => el.getAttribute("data-event-id"),
        currentEvent
      );

      const component = await page.evaluate(
        (el) => el.getAttribute("data-event-component"),
        currentEvent
      );

      const dateElement = await currentEvent.$(
        "div:first-child .row:first-child"
      );

      const fullDate = await page.evaluate((el) => el.textContent, dateElement);

      if (!title || !courseId || !id || !component || !fullDate) continue;

      if (
        ["review", "feedback", "bootstrap"].some((word) =>
          title.toLowerCase().includes(word)
        )
      )
        continue;

      const courseNameElement = await currentEvent.$(
        "div:first-child .row:last-child div:last-child"
      );

      const courseName = await page.evaluate(
        (el) => el.textContent,
        courseNameElement
      );

      let parts = trim(fullDate).split(", "),
        date = null;

      if (!parts || parts.length <= 0) continue;

      let time = parts[parts.length - 1];

      if (parts.length === 3) {
        date = parts[1];
        const [d, M] = date.split(" ");
        const day = d.length === 1 ? `0${d}` : d;
        let month = `${new Date(`${M} 1, 2021`).getMonth() + 1}`;
        month = month.length === 1 ? `0${month}` : month;
        date = `${new Date().getFullYear()}/${month}/${day}`;
      } else {
        let _ =
          parts[0] === "Tomorrow"
            ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            : new Date();
        date = _.toISOString().split("T")[0].replaceAll("-", "/");
      }

      grades.upcoming_events.push({
        id,
        course: {
          id: courseId,
          name: trim(courseName),
        },
        title:
          component === "mod_scheduler"
            ? title.replace("your Teacher, ", "")
            : title,
        date,
        time,
        component,
        is_review: time.includes("»"),
      });
    }
  }

  write("Retrieving grades missing from course view", 97);

  await page.goto(urls.graph);

  await page.waitForXPath(
    "/html/body/div[4]/div[1]/div[2]/section/div/div/div/div[2]/div[1]"
  );

  const listInfo = await page.$x(
    "/html/body/div[4]/div[1]/div[2]/section/div/div/div/div[1]/div[1]/div[2]"
  );

  if (listInfo.length > 0) {
    const infos = await listInfo[0]?.$$("div");
    const [o, t, th, f, fi, s, last] = infos;

    if (f) {
      let promotionContentSpan = await f.$("span.content");
      let promotion = await page.evaluate(
        (el) => el.textContent,
        promotionContentSpan
      );

      if (promotion) {
        grades.student.promotion = trim(promotion);
      }
    }

    if (last) {
      let campusContentSpan = await last.$("span.content");
      let campus = await page.evaluate(
        (el) => el.textContent,
        campusContentSpan
      );

      if (campus) {
        grades.student.campus = trim(campus);
      }
    }
  }

  const projetsList = await page.$x(
    "/html/body/div[4]/div[1]/div[2]/section/div/div/div/div[2]/div[1]"
  );

  if (projetsList.length > 0) {
    const details = await projetsList[0]?.$$("details.projects-details");

    if (details.length > 0) {
      for (const line of details) {
        const members = [];
        const events = [];

        const summary = await line.$("summary.projects-summary");

        const courseTitle = (
          await page.evaluate((el) => el.textContent, summary)
        ).split(" ")[0];

        if (courseTitle) {
          const course = grades.semesters
            .find((s) => s.name === DEFAULT_SEMESTER_NAME)
            ?.courses.find((c) => c.name === courseTitle);

          const gradeSpan = await line.$$("small > span");

          if (gradeSpan.length > 0) {
            const grade = await page.evaluate(
              (el) => el.textContent,
              gradeSpan[0]
            );

            if (course) {
              if (course.days.length > 0) {
                let finalGrade = course.days.find(
                  (d) => d.assignments === "Course final grade"
                );

                if (!finalGrade) {
                  course.days.push({
                    name: "",
                    topic: "",
                    assignments: "Course final grade",
                    due_date: "-",
                    submission: "No submission",
                    grade: grade,
                  });
                }
              }
            }
          }

          const projectContainer = await line.$$("div.flex-project");

          if (projectContainer.length > 0) {
            const $events = await projectContainer[0]?.$$("table > tbody > tr");

            if ($events.length > 0) {
              for (const scheduler of $events) {
                const cells = await scheduler.$$("td");

                if (cells.length > 0) {
                  const activity = await page.evaluate(
                    (el) => el.textContent,
                    cells[0]
                  );
                  const enrolled = await page.evaluate(
                    (el) => el.textContent,
                    cells[1]
                  );
                  const attended = await page.evaluate(
                    (el) => el.textContent,
                    cells[2]
                  );
                  const date = await page.evaluate(
                    (el) => el.textContent,
                    cells[3]
                  );
                  const comment = await page.evaluate(
                    (el) => el.textContent,
                    cells[4]
                  );

                  events.push({
                    activity: trim(activity),
                    enrolled: trim(enrolled),
                    attended: trim(attended),
                    date: trim(date),
                    comment: trim(comment),
                  });
                }
              }
            }
          }

          const teamContainer = await line.$$("details");

          if (teamContainer.length > 0) {
            let summary = await teamContainer[0]?.$$("summary");

            if (summary.length > 0) {
              const team = await page.evaluate(
                (el) => el.textContent,
                summary[0]
              );

              if (course) {
                course.team = trim(team);
              }
            }

            let membersContainer = await teamContainer[0]?.$$("ul");

            if (membersContainer.length > 0) {
              const $members = await membersContainer[0]?.$$("li");

              if ($members.length > 0) {
                for (const member of $members) {
                  const email = await page.evaluate(
                    (el) => el.textContent,
                    member
                  );
                  members.push(trim(email));
                }
              }
            }
          }

          if (course) {
            course.members = members;
            course.events = events;
          }
        }
      }
    }
  }

  // TODO: Retrieve badges
  // TODO: Retrieve GPA

  write("Generating the report", 99);

  for (const course of grades.semesters[0].courses) {
    let lastDueDate = course?.days
        ?.slice()
        ?.reverse()
        ?.find((d) => d.due_date !== "-")?.due_date,
      firstDueDate = course?.days?.find((d) => d.due_date !== "-")?.due_date;

    if (!firstDueDate || !lastDueDate || new Date(lastDueDate) > new Date()) {
      grades.semesters[0].courses = grades.semesters[0].courses.filter(
        (c) => c.name !== course.name
      );
      continue;
    }

    if (firstDueDate) {
      for (const semesterDate of semestersDates) {
        if (!semesterDate.start || !semesterDate.end) continue;

        if (
          new Date(firstDueDate) >= new Date(semesterDate.start) &&
          new Date(firstDueDate) <= new Date(semesterDate.end)
        ) {
          if (!grades.semesters.find((s) => s.name === semesterDate.name)) {
            grades.semesters.push({
              name: semesterDate.name,
              courses: [course],
              created_at: firstDueDate,
            });
          } else {
            grades.semesters
              .find((s) => s.name === semesterDate.name)
              ?.courses.push(course);
          }
        }
      }
    }

    if (lastDueDate) course.created_at = lastDueDate;
  }

  grades.semesters = grades.semesters.filter(
    (s) => s.courses.length > 0 && s.name !== DEFAULT_SEMESTER_NAME
  );

  for (const semester of grades.semesters) {
    semester.created_at = semester?.courses[0]?.created_at ?? null;
  }

  grades.created_at = now();

  fs.writeFileSync(files.report, JSON.stringify(grades), "utf8");

  write(`All tasks done (in ${getDuration()}) 🚀`, 100);
  exit(browser);
})();

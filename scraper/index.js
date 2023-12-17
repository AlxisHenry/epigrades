import fs from "fs";
import puppeteer from "puppeteer";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Email and password are required");
  process.exit(1);
}

const otpCodeFile = `scraper/otp/${email.split("@")[0]}.json`;
const progressFile = `scraper/progress/${email.split("@")[0]}.json`;
const reportFile = `scraper/reports/${email.split("@")[0]}.json`;

if (fs.existsSync(otpCodeFile)) {
  fs.unlinkSync(otpCodeFile);
}

if (fs.existsSync(progressFile)) {
  fs.unlinkSync(progressFile);
}

const write = (currentStep, progress, status = 0) => {
  fs.writeFileSync(
    progressFile,
    JSON.stringify({ currentStep, progress, status }),
    "utf8"
  );
};

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: ["--disable-features=site-per-process"],
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

  await page.waitForNavigation();

  await page.waitForXPath('//*[@id="passwordInput"]');
  const passwordInput = await page.$x('//*[@id="passwordInput"]');
  await passwordInput[0].type(password);

  await page.waitForXPath('//*[@id="submitButton"]');
  const submitButton = await page.$x('//*[@id="submitButton"]');
  await submitButton[0].click();

  await page.waitForNavigation();

  let phone = await page.$x(
    '//*[@id="idDiv_SAOTCS_Proofs"]/div[1]/div/div/div[2]/div'
  );
  phone = await page.evaluate((el) => el.textContent, phone[0]);
  phone = phone.replace(/\s/g, "").split("+")[1];

  await page.waitForXPath('//*[@id="idDiv_SAOTCS_Proofs"]/div[1]/div/div');
  const sendCodeButton = await page.$x(
    '//*[@id="idDiv_SAOTCS_Proofs"]/div[1]/div/div'
  );
  await sendCodeButton[0].click();

  write("Waiting for 2FA code sent to " + phone, 10);

  while (!fs.existsSync(otpCodeFile)) {
    await new Promise((r) => setTimeout(r, 1000));
  }

  const code = JSON.parse(fs.readFileSync(otpCodeFile, "utf8")).code;
  await page.waitForXPath(
    "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[3]/div/div[3]/div/input"
  );
  const codeInput = await page.$x(
    "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[3]/div/div[3]/div/input"
  );
  await codeInput[0].type(code);
  await page.waitForXPath(
    "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[6]/div/div/div/div/input"
  );
  const submitCodeButton = await page.$x(
    "/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[6]/div/div/div/div/input"
  );
  await submitCodeButton[0].click();

  write("The code has been correctly submitted", 15);

  await page.waitForXPath(
    "/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input"
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

  for (let i = 0; i < coursesCount; i++) {
    let currentProgress = 25 + (i / coursesCount) * 75;
    const course = courses[i];
    const element = await course.$("a");
    const link = await page.evaluate((el) => el.href, element);
    const name = await page.evaluate((el) => el.textContent, element);

    const coursePage = await browser.newPage();
    await coursePage.goto(link);
    write(`Retrieving ${name} - ${i + 1}/${coursesCount}`, currentProgress);

    // await coursePage.waitForNavigation();
    // await page.waitForXPath(
    //   "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[5]/ul"
    // );

    // const actionsMenu = await page.$x(
    //   "/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[5]/ul"
    // );

    // const actions = await actionsMenu[0].$$("li");

    // console.log(actions);

    // actions.forEach(async (element) => {
    //   const name = await page.evaluate((el) => el.textContent, element);
    //   if (name === "Assignments") {
    //     console.log(`Course ${name} has assignments`);
    //   }
    // });

    await coursePage.close();
  }

  write("Generating the report", 100, 1);

  // todo: generate report
  
  setTimeout(async () => {
    await browser.close();
    fs.unlinkSync(otpCodeFile);
    fs.unlinkSync(progressFile);
    process.exit(0);
  }, 1000);
})();

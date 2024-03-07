"use client";

import "@/styles/pages/tutorial.scss";

import Image from "next/legacy/image";

import { Layout } from "@/components";

export default function Home() {
  return (
    <Layout>
      <div className="title">EPIGRADES</div>
      <div className="tutorial">
        <Section title="What's Epigrades?">
          <Paragraph>
            Epigrades is a tool for Epitech students (in MSc-Pro) that allows
            them to retrieve all the necessary information for their academic
            journey in less than <Highlight>2 minutes</Highlight>! The
            application gathers upcoming events and projects, completed
            projects, as well as the corresponding grades and notes. All of this
            is made available to the student on a clean and confidential page.
            This is an open-source project, and the code is available on{" "}
            <Link
              href="https://github.com/AlxisHenry/epigrades"
              title="GitHub"
              blank
            />
            . You can access to the preview of the application{" "}
            <Link href="/online/me" title="here" /> (it&apos;s my report).
          </Paragraph>
          <Paragraph>
            I created this application because I was tired of the Epitech
            intranet, which is slow and not user-friendly. This application use
            puppeteer to scrape the intranet and retrieve a lot of informations.
            I also use the Epitech API to be sure the provided credentials are
            correct. I can&apos;t use Microsoft OAuth because the scrapper need
            to login on a clean browser (without any cookies).
          </Paragraph>
          <Alert type="danger" title={"Important"}>
            Note that I do not store any of your data. I only use it to
            authenticate you on the Epitech intranet.
          </Alert>
        </Section>
        <Section title="Why use Epigrades?">
          <Paragraph>
            The application is designed to be as fast as possible. The user
            experience is optimized to be as smooth as possible. The user can
            access all the necessary information in less than 2 minutes{" "}
            <Highlight>guaranteed</Highlight>. For example, by running the
            application every day you will have access to your upcoming events
            or courses and you will be able to prepare for them.
          </Paragraph>
          <Grid title="Easy to use" image="/screenshots/online.png" />
          <Grid title="Fast and clean" image="/screenshots/fast.png" reverse />
          <Grid title="Open-source" image="/screenshots/github.png" />
        </Section>
        <Section title="How to use it?">
          <Paragraph>
            Epigrades is designed to be as simple as possible. You only need to
            make <Highlight>2 steps</Highlight> and we will do the rest for you.
            Go to the <Link href="/online" title="online" blank /> page and
            follow the instructions.
          </Paragraph>
          <Grid title="Sign-in" image="/screenshots/sign-in.png" />
          <Alert type="info" title="Note">
            If your account is already linked to a report, you will be asked to
            access to it or create a new one.
          </Alert>
          <Grid title="Confirm 2FA" image="/screenshots/2FA.png" reverse />
          <Alert type="info" title="Note">
            Epigrades supports 2FA (Two-Factor Authentication) with the
            Microsoft Authenticator app or by SMS. Depending on your account
            settings.
          </Alert>
          <Paragraph>
            Once you have completed these steps, a modal will appear with a
            button to access to your report. Your report will be{" "}
            <Highlight>anonymized</Highlight> by a token. You can share this
            token with anyone you want to give access to your report.
          </Paragraph>
          <Screen src="/screenshots/report.png" />
          <Alert type="tips" title="Tips">
            You can access to your report at any time by saving the url or by
            sign-in again.
          </Alert>
          <Paragraph>
            In the case you run the application with already a report, the token
            will be the same. So you can share it with anyone you want to give
            access to your maintained report.
          </Paragraph>
        </Section>
        <Section title="What does Epigrades offer?">
          <Paragraph>
            Epigrades has a lot of features to offer to provide a better
            experience for the student and to help him in his academic journey.
            Here are some of the features:
          </Paragraph>
          <Grid title="Statistics" image="/screenshots/report.png" />
          <Alert type="warning" title="Note">
            GPA and credits are not available yet. Because of the slowness of
            Epitech...
          </Alert>
          <Grid
            title="Upcoming events"
            image="/screenshots/events.png"
            reverse
          />
          <Grid
            title="Incoming courses"
            image="/screenshots/incoming-courses.png"
          />
          <Grid title="Grades" image="/screenshots/grades.png" reverse />
          <Paragraph>
            The application also offers the possibility to export your report in
            PDF format. This feature is available in the top of the report page.
          </Paragraph>
          <Grid title="PDF Export" image="/screenshots/pdf.png" />
          <Alert type="tips" title="Tips">
            When multiple semesters are available, the export is a zip file with
            a PDF for each semester.
          </Alert>
          <Grid
            title="Course details"
            image="/screenshots/course.png"
            reverse
          />
        </Section>
      </div>
    </Layout>
  );
}

interface AlertProps {
  children: React.ReactNode;
  title?: string | null;
  type?: "tips" | "warning" | "danger" | "info";
}

export function Alert({ children, title = null, type = "info" }: AlertProps) {
  return (
    <div className={`alert ${type}`}>
      <h3>{title ?? type}</h3>
      <Paragraph>{children}</Paragraph>
    </div>
  );
}

interface LinkProps {
  href: string;
  title: string;
  blank?: boolean;
}

function Link({ href, title, blank = false }: LinkProps) {
  return (
    <a href={href} className="link" target={blank ? "_blank" : "_self"}>
      {title}
    </a>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string | null;
}

function Section({ children, title = null }: SectionProps) {
  return (
    <div className="section">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
}

function Paragraph({ children }: ParagraphProps) {
  return <p className="paragraph">{children}</p>;
}

interface HighlightProps {
  children: React.ReactNode;
}

function Highlight({ children }: HighlightProps) {
  return (
    <span className="highlight-container">
      <span className="highlight">{children}</span>
    </span>
  );
}

interface GridProps {
  title: string;
  image: string;
  reverse?: boolean;
}

function Grid({ title, image, reverse = false }: GridProps) {
  return (
    <div className={`grid ${reverse ? "reverse" : ""}`}>
      {reverse && <Screen src={image} />}
      <h3>{title}</h3>
      {!reverse && <Screen src={image} />}
    </div>
  );
}

interface ScreenProps {
  src: string;
  alt?: string;
}

function Screen({ src, alt }: ScreenProps) {
  return (
    <div className="screen">
      <Image
        width={200}
        height={200 / (16 / 9)}
        layout="responsive"
        src={src}
        alt={alt ?? "Screen"}
      />
    </div>
  );
}

"use client";

import "@/styles/pages/tutorial.scss";

import { Layout, PageTitle } from "@/components";
import Image from "next/image";

const props = {
  width: 200,
  height: 200 / (16 / 9),
  layout: "responsive",
  alt: "Profile Picture",
};

export default function Home() {
  return (
    <Layout>
      <div className="title">EPIGRADES</div>
      <div className="tutorial">
        <Section title="What is Epigrades?">
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
            />
            .
          </Paragraph>
        </Section>
        <Section title="Why use Epigrades?">
          <Paragraph>
            The application is designed to be as fast as possible. The user
            experience is optimized to be as smooth as possible. The user can
            access all the necessary information in less than 2 minutes{" "}
            <Highlight>guaranteed</Highlight>.
          </Paragraph>
          <Grid title="Faster than gandalf" image="/screenshots/online.png" />
          <Grid
            title="Clean and confidential"
            image="/screenshots/online.png"
            reverse
          />
          <Grid title="Open-source" image="/screenshots/online.png" />
        </Section>
        <Section title="How to use it?">
          <Paragraph>
            Epigrades is designed to be as simple as possible. The user only has
            to log in with his Epitech credentials and the application will do
            the rest. The user will be redirected to a clean and confidential
            secured by a token.
          </Paragraph>
        </Section>
      </div>
    </Layout>
  );
}

interface LinkProps {
  href: string;
  title: string;
}

function Link({ href, title }: LinkProps) {
  return (
    <a href={href} target="_blank">
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
    <div className="text">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
}

function Paragraph({ children }: ParagraphProps) {
  return <p>{children}</p>;
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

interface ImageProps {
  src: string;
}

function Screen({ src }: ImageProps) {
  return <Image {...props} src={src} />;
}

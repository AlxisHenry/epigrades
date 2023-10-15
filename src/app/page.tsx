"use client";

import "@/styles/pages/home.scss";
import Layout from "@/components/Layout";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <PageTitle parts={["Welcome ✋"]} />
      <div className="description">
        On this site you will find my grades from my time at Epitech Strasbourg,
        ordered by semester and by module. You also have access to some
        statistics about my grades. You can see my grades for each semester by
        clicking on the wanted semester in the dropdown menu. To have global
        statistics about my grades you can click
        <Link className="link" href={"/stats"}>
          here
        </Link>
        or on the &quot;Statistics&quot; button in the navbar.
        <br />
        <br />
        I&apos;m a developer with a passion for exploring new programming
        languages and technologies. I believe that it is essential to have a
        broad understanding of different programming paradigms and practices in
        order to create effective solutions to complex problems. I am always
        eager to learn and improve my skills. My goal is to stay up-to-date with
        the latest trends and best practices in the tech industry, and to
        continuously expand my knowledge and capabilities. So if you&apos;re
        looking for a developer who is not afraid to take on new challenges and
        explore uncharted territory, look no further!
        <br />
      </div>
      <div className="links">
        <a
          className="link"
          href="https://github.com/AlxisHenry"
          target="_blank"
        >
          Github
        </a>
        <a
          className="link"
          href="https://www.linkedin.com/in/alexishenry03/"
          target="_blank"
        >
          LinkedIn
        </a>
        <a className="link" href="https://alexishenry.eu" target="_blank">
          Portfolio
        </a>
      </div>
    </Layout>
  );
}

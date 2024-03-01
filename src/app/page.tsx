"use client";

import "@/styles/pages/tutorial.scss";

import { Layout, PageTitle } from "@/components";
import Image from "next/image";

const props = {
  style: {
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.4)",
  },
  width: 200,
  height: 200 / (16 / 9),
  layout: "responsive",
  alt: "Profile Picture",
};

export default function Home() {
  return (
    <Layout>
      <PageTitle parts={["Epigrades 🎓"]} />
      <div className="tutorial">
        <div className="text">
          <h1>What is Epigrades?</h1>
          <p>
            Epigrades is an online platform that allows students to keep track
            of their grades and assignments. It is designed to be simple and
            easy to use. It is also free and open source.
          </p>
        </div>
        <a href="">
          Lien vers la vidéo
        </a>
        <Image {...props} src="/screenshots/online.png" />
        <div className="grid">
          <h1>What is Epigrades?</h1>
          <Image {...props} src="/screenshots/online.png" />
        </div>
        <div className="grid">
          <Image {...props} src="/screenshots/online.png" />
          <h1>How to use Epigrades?</h1>
        </div>
        <div className="grid">
          <h1>What is Epigrades?</h1>
          <Image {...props} src="/screenshots/online.png" />
        </div>
        <div className="grid">
          <Image {...props} src="/screenshots/online.png" />
          <h1>How to use Epigrades?</h1>
        </div>
        <div className="grid">
          <h1>What is Epigrades?</h1>
          <Image {...props} src="/screenshots/online.png" />
        </div>
        <div className="grid">
          <Image {...props} src="/screenshots/online.png" />
          <h1>How to use Epigrades?</h1>
        </div>
        <div className="grid">
          <h1>What is Epigrades?</h1>
          <Image {...props} src="/screenshots/online.png" />
        </div>
        <div className="grid">
          <Image {...props} src="/screenshots/online.png" />
          <h1>How to use Epigrades?</h1>
        </div>
      </div>
    </Layout>
  );
}

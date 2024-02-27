"use client";

import "@/styles/pages/home.scss";

import { Layout, PageTitle } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <PageTitle parts={["Welcome ✋"]} />
      <div>
        <Image
          src="/screenshots/report.png"
          alt="Next.js"
          layout="responsive"
          width={200}
          height={200 / (16 / 9)}
          objectFit="cover"
        />
      </div>
    </Layout>
  );
}

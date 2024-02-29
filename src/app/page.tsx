"use client";

import "@/styles/pages/home.scss";

import Link from "next/link";

import { Layout, PageTitle } from "@/components";

export default function Home() {
  return (
    <Layout>
      <PageTitle parts={["Welcome ✋"]} />
      <div>
        width={200}
          height={200 / (16 / 9)}
          objectFit="cover"
      </div>
    </Layout>
  );
}

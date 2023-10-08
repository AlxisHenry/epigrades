"use client";

import './global.css';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

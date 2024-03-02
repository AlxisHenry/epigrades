import "./global.css";
import "@/styles/app.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Epigrades",
  description: "Faster than Gandalf 🤭",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["epigrades", "grades", "epitech", "strasbourg", "epi", "gandalf"],
  authors: [
    { name: "Alexis Henry" },
    {
      name: "Alexis Henry",
      url: "https://www.linkedin.com/in/alexishenry03/",
    },
  ],
  icons: [
    { rel: "icon", url: "/icons/32x32.png" },
    { rel: "icon", url: "/icons/192x192.png", sizes: "192x192" },
    { rel: "apple-touch-icon", url: "/icons/180x180.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

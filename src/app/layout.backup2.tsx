import CommonLayout from "@/components/client-view/common-layout";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talat Mahmud A Software Engineer",
  description:
    "Talat Mahmud a Software Engineer, a MERN Stack Web Developer with experience in HTML, CSS, Bootstrap, Tailwind CSS, JavaScript, React.js, Next.js, Material UI, Daisy UI, Context API, React Hooks, React Query, Redux and more. Skilled in creating impactful websites with strong problem-solving and collaboration skills.",
  authors: [
    {
      name: "Talat Mahmud",
      url: siteConfig.siteUrl,
    },
  ],
  keywords: [
    "Talat Mahmud",
    "Software Engineer",
    "Web Developer",
    "MERN Stack",
    "React.js",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Material UI",
    "MongoDB",
    "Express.js",
    "Portfolio",
    "Frontend Developer",
  ],
  creator: "Talat Mahmud",
  metadataBase: new URL(siteConfig.siteUrl),

  openGraph: {
    title: "Talat Mahmud A Software Engineer",
    description:
      "Explore the portfolio of Talat Mahmud, a skilled MERN Stack Developer building scalable web applications.",
    url: siteConfig.siteUrl,
    siteName: "Talat Mahmud Portfolio",
    locale: "en_US",
    type: "website",
    images: siteConfig.ogImageUrl
      ? [{ url: siteConfig.ogImageUrl, width: 1200, height: 630, alt: "Talat Mahmud" }]
      : undefined,
  },

  alternates: {
    canonical: siteConfig.siteUrl,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-black-600`}>
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}

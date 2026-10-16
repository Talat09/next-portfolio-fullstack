import CommonLayout from "@/components/client-view/common-layout";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { PERSON_NAME, PERSON_ROLE, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Optional override; otherwise app/opengraph-image.jpg and app/twitter-image.jpg are used.
const ogImages = siteConfig.ogImageUrl
  ? [{ url: siteConfig.ogImageUrl, width: 1200, height: 630, alt: `${PERSON_NAME} — ${PERSON_ROLE}` }]
  : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${PERSON_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: `${PERSON_NAME} Portfolio`,
  category: "technology",
  keywords: [
    PERSON_NAME,
    ...siteConfig.personAltNames,
    `${PERSON_NAME} software engineer`,
    `${PERSON_NAME} developer`,
    `${PERSON_NAME} portfolio`,
    "Full Stack Software Engineer",
    "Full Stack Developer Bangladesh",
    "Software Engineer Dhaka",
    "MERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "AI Integration",
    "SaaS Development",
    "TypeScript",
    "Node.js",
    "MongoDB",
  ],
  authors: [{ name: PERSON_NAME, url: siteConfig.siteUrl }],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Talat",
    lastName: "Mahmud",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: `${PERSON_NAME} Portfolio`,
    locale: "en_US",
    ...(ogImages ? { images: ogImages } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ...(ogImages ? { images: ogImages.map((i) => i.url) } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(siteConfig.googleSiteVerification
    ? { verification: { google: siteConfig.googleSiteVerification } }
    : {}),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1a9e55",
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

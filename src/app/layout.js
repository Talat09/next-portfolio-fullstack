import CommonLayout from "@/components/client-view/common-layout";
import "./globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Talat Mahmud A Software Engineer",
  description:
    "Talat Mahmud a Software Engineer, a MERN Stack Web Developer with experience in HTML, CSS,Bootstrap,Tailwind Css, JavaScript, React.js,Material Ui, Daisy Ui,Context API,React Hooks,React Query,Redux and more. Skilled in creating impactful websites with strong problem-solving and collaboration skills.",
  authors: [
    {
      name: "Talat Mahmud",
      url: "https://talat-mahmud-portfolio.vercel.app",
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
  metadataBase: new URL("https://talat-mahmud-portfolio.vercel.app"),

  openGraph: {
    title: "Talat Mahmud A Software Engineer",
    description:
      "Explore the portfolio of Talat Mahmud, a skilled MERN Stack Developer building scalable web applications.",
    url: "https://talat-mahmud-portfolio.vercel.app",
    siteName: "Talat Mahmud Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://talat-mahmud-portfolio.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co%2FBfLLNMd%2FTalat-Mahmud-image.png&w=1920&q=100",
        width: 1200,
        height: 630,
        alt: "Talat Mahmud",
      },
    ],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}

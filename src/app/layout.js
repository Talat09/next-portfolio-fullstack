import CommonLayout from "@/components/client-view/common-layout";
import "./globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Talat Mahmud",
  description:
    "Talat Mahmud- a Software Engineer, a Web Developer with experience in HTML, CSS, JavaScript, React.js, and more. Skilled in creating impactful websites with strong problem-solving and collaboration skills.",
  author: "Talat Mahmud",
  social: {
    linkedin: "https://www.linkedin.com/in/talat09/",
    facebook: "https://www.facebook.com/talatmahmud.dihan/",
    instagram: "https://www.instagram.com/talatmahmud.dihan/",
    github: "https://github.com/Talat09/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta
          name="keywords"
          content="Talat Mahmud,Software Engineer, Web Developer, HTML, CSS, JavaScript, React.js, Next.js, Tailwind CSS, Material UI, Daisy UI, Express.js, MongoDB, MySQL, IT/Web Development, Creative Development, Projects, Clients"
        />
        <meta name="author" content={metadata.author} />
        <title>{metadata.title}</title>
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://talat-mahmud-portfolio.vercel.app/"
        />
        <meta
          property="og:image"
          content="https://talat-mahmud-portfolio.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co%2FBfLLNMd%2FTalat-Mahmud-image.png&w=1920&q=100"
        />
        <meta property="og:site_name" content={metadata.title} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:author" content={metadata.author} />
        <meta property="og:linkedin" content={metadata.social.linkedin} />
        <meta property="og:facebook" content={metadata.social.facebook} />
        <meta property="og:instagram" content={metadata.social.instagram} />
        <meta property="og:github" content={metadata.social.github} />
      </Head>
      <body className={inter.className}>
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}

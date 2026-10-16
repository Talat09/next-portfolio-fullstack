"use client";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import Image from "next/image";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaCode,
  FaChartBar,
  FaDownload,
  FaPaperPlane,
} from "react-icons/fa";
import profileImage from "@/assets/Talat-Mahmud-image.png";

// TODO: put the CV file in /public with this name (or change the link)
const CV_LINK = "/Talat-Mahmud-CV.pdf";

const socialIcons = [
  {
    id: "facebook",
    label: "Facebook",
    Icon: FaFacebookSquare,
    socialLink: "https://www.facebook.com/profile.php?id=100010332459337",
  },
  {
    id: "github",
    label: "GitHub",
    Icon: FaGithub,
    socialLink: "https://github.com/Talat09",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: FaLinkedin,
    socialLink: "https://www.linkedin.com/in/talat09/",
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    socialLink:
      "https://www.instagram.com/dihan.talat/?igshid=NzZlODBkYWE4Ng%3D%3D&fbclid=IwAR0xCmMoc7WR7ZDVZkcKRAf_3gIYMTZYaZEIUG9DU8z_wZz8cIZ69-nktTs",
  },
];

function DotGrid({ className }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute grid grid-cols-5 gap-2 ${className}`}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#1a9e55]/25" />
      ))}
    </div>
  );
}

export default function ClientHomeView({ data, yearOfExperience }) {
  const homeData = data && data.length ? data[0] : null;
  const words = homeData?.heading ? homeData.heading.split(" ") : [];

  return (
    <section
      className="relative max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto"
      id="home"
    >
      {/* soft background circles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 -left-40 w-80 h-80 rounded-full bg-[#e6f6ec]/70" />
        <div className="absolute bottom-0 -left-20 w-56 h-56 rounded-full bg-[#eaf8f0]/70" />
        <div className="absolute top-10 right-[30%] w-52 h-52 rounded-full bg-[#eef9f2]" />
        <div className="absolute top-28 -right-16 w-40 h-40 rounded-full bg-[#e6f6ec]/80" />
        <div className="absolute bottom-10 right-4 w-24 h-24 rounded-full bg-[#e6f6ec]/80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-6 pt-6 pb-12 sm:pt-8 sm:pb-16 items-center">
        <div className="flex flex-col items-start order-2 md:order-1">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-[#e8f6ee] px-4 py-2 text-[13px] font-medium text-[#111827]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a9e55]" />
            Full Stack Web Developer
          </span>
          <h1 className="mt-6 mb-5 text-[44px] sm:text-[56px] lg:text-[60px] xl:text-[64px] font-extrabold leading-[1.08] tracking-tight text-[#111827]">
            {words.map((item, index) => (
              <span key={index}>
                <span
                  className={
                    index === 2 || index === 3
                      ? "text-[#1a9e55]"
                      : "text-[#111827]"
                  }
                >
                  {item}
                </span>
                {index === 2 || index === 3 ? (
                  <br className="hidden sm:block" />
                ) : null}{" "}
              </span>
            ))}
          </h1>
          <p className="text-[#4b5563] text-[15px] leading-[1.65] mb-8 max-w-[480px]">
            {homeData?.summary}
          </p>
          <div className="flex flex-wrap gap-4 mb-9">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scroller.scrollTo("contact", {
                  duration: 1500,
                  delay: 100,
                  smooth: true,
                  offset: -80,
                });
              }}
              className="inline-flex items-center gap-2.5 py-3.5 px-6 bg-[#0f7a3d] hover:bg-[#0c6532] text-white-500 font-semibold rounded-lg text-[15px] shadow-[0_12px_24px_-12px_rgba(15,122,61,0.8)] transition-all"
            >
              <FaPaperPlane aria-hidden="true" />
              Let&apos;s Work Together
            </a>
            <a
              href={CV_LINK}
              download
              className="inline-flex items-center gap-2.5 py-3.5 px-9 border-[1.5px] border-[#1a9e55] text-[#1a9e55] bg-white-500 font-semibold rounded-lg text-[15px] hover:bg-[#e8f6ee] transition-all"
            >
              <FaDownload aria-hidden="true" />
              Download CV
            </a>
          </div>
          <ul className="flex gap-5">
            {socialIcons.map(({ id, label, Icon, socialLink }) => (
              <li key={id}>
                <motion.a
                  href={socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  className="block text-[#1a9e55] hover:text-[#0f7a3d]"
                >
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </motion.a>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center order-1 md:order-2 pt-10">
          <div className="relative w-[290px] h-[330px] sm:w-[340px] sm:h-[380px] lg:w-[360px] lg:h-[400px]">
            <DotGrid className="-left-14 top-0" />
            <DotGrid className="-right-24 top-32 hidden sm:grid" />
            {/* white tilted frame */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[44px] bg-white-500 rotate-[5deg] shadow-[0_30px_60px_-20px_rgba(15,122,61,0.35)]"
            />
            {/* green rounded square */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[34px] bg-[#1a9e55] rotate-[5deg] overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white-500/10" />
            </div>
            {/* photo cutout overlapping the top */}
            <div className="absolute left-0 right-0 bottom-0 -top-14 overflow-hidden rounded-b-[34px]">
              <Image
                src={profileImage}
                alt="Talat Mahmud"
                fill
                priority
                sizes="(max-width: 640px) 290px, 360px"
                className="object-contain object-bottom"
              />
            </div>
            <div className="absolute -left-12 sm:-left-16 top-[30%] bg-white-500 rounded-xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)] px-4 py-4 flex flex-col items-center text-center w-[120px]">
              <FaCode className="text-[#1a9e55] w-6 h-6 mb-2" aria-hidden="true" />
              <span className="text-[11px] font-medium text-[#374151] leading-tight">
                Turning Ideas Into Reality
              </span>
            </div>
            <div className="absolute -right-8 sm:-right-14 bottom-0 bg-white-500 rounded-2xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)] px-5 py-4 flex flex-col items-center text-center w-[128px]">
              <FaChartBar className="text-[#1a9e55] w-7 h-7 mb-2" aria-hidden="true" />
              <span className="text-[15px] font-extrabold text-[#111827]">{yearOfExperience || "0"}+ Years</span>
              <span className="text-[11px] text-[#4b5563] leading-tight">
                Building Web Solutions
              </span>
            </div>
            {/* handwritten signature + squiggle + arrow */}
            <div
              aria-hidden="true"
              className="absolute -top-14 -right-14 sm:-right-28 text-[#1a9e55] hidden sm:block"
            >
              <svg width="26" height="30" viewBox="0 0 26 30" className="absolute -left-10 -top-2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 10c0-6 12-6 12 1 0 5-8 6-8 11 0 3 4 4 7 2" />
                <circle cx="20" cy="26" r="1.5" fill="currentColor" />
              </svg>
              <span
                className="block -rotate-[10deg] text-[26px] leading-[1.05] font-semibold"
                style={{ fontFamily: "'Segoe Script', 'Brush Script MT', 'Lucida Handwriting', cursive" }}
              >
                Talat
                <br />
                <span className="ml-4">Mahmud</span>
              </span>
              <svg width="50" height="46" viewBox="0 0 50 46" className="ml-6 mt-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M40 4c4 18-6 32-30 34" />
                <path d="M16 31l-7 7 9 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

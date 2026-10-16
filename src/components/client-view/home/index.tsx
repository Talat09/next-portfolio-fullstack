"use client";
import { LazyMotion, m, domMax } from "framer-motion";
import { useRef } from "react";
import { scroller } from "react-scroll";
import { scrollDuration } from "@/lib/motion";
import type { IconType } from "react-icons";
import { siteConfig, type SocialId } from "@/lib/site-config";
import type { Home } from "@/types";
import Image from "next/image";
import { DotGrid } from "../decor";
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

// CV link comes from NEXT_PUBLIC_CV_URL; the button is hidden when it is not set.
const CV_LINK = siteConfig.cvUrl;

const socialIcons = ([
  {
    id: "facebook",
    label: "Facebook",
    Icon: FaFacebookSquare,
    socialLink: siteConfig.social.facebook,
  },
  {
    id: "github",
    label: "GitHub",
    Icon: FaGithub,
    socialLink: siteConfig.social.github,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: FaLinkedin,
    socialLink: siteConfig.social.linkedin,
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    socialLink: siteConfig.social.instagram,
  },
] as { id: SocialId; label: string; Icon: IconType; socialLink: string }[]).filter((s) => s.socialLink);

export default function ClientHomeView({
  data,
  yearOfExperience,
}: {
  data?: Home[];
  yearOfExperience?: string | null;
}) {
  // area the photo card can be dragged around in (springs back on release)
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const homeData = data && data.length ? data[0] : null;
  const words = homeData?.heading ? homeData.heading.split(" ") : [];

  return (
    <section className="relative overflow-x-hidden" id="home">
      {/* soft background circles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 -left-40 w-80 h-80 rounded-full bg-[#e6f6ec]/70" />
        <div className="absolute bottom-0 -left-20 w-56 h-56 rounded-full bg-[#eaf8f0]/70" />
        <div className="absolute top-10 right-[30%] w-52 h-52 rounded-full bg-[#eef9f2]" />
        <div className="absolute top-28 -right-16 w-40 h-40 rounded-full bg-[#e6f6ec]/80" />
        <div className="absolute bottom-10 right-4 w-24 h-24 rounded-full bg-[#e6f6ec]/80" />
      </div>

      <div className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 pt-6 pb-12 sm:pt-8 sm:pb-16 items-center">
        <div className="flex flex-col items-start order-2 lg:order-1">
          {/* One h1 for the page: name + role pill and the headline, styled as before */}
          <h1 className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-[#e8f6ee] px-4 py-2 text-[13px] font-medium text-[#111827]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a9e55]" aria-hidden="true" />
            Talat Mahmud &middot; Full Stack Software Engineer
          </span>
          {/* keeps the pill and headline as separate phrases for screen readers/search */}
          <span className="sr-only"> - </span>
          <span className="block mt-6 mb-5 text-[44px] sm:text-[56px] lg:text-[60px] xl:text-[64px] font-extrabold leading-[1.08] tracking-tight text-[#111827]">
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
          </span>
          </h1>
          <p className="text-[#4b5563] text-base leading-7 mb-8 max-w-[52ch]">
            {homeData?.summary}
          </p>
          <div className="flex flex-wrap gap-4 mb-9">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scroller.scrollTo("contact", {
                  duration: scrollDuration(1500),
                  delay: 100,
                  smooth: true,
                  offset: -80,
                });
              }}
              className="btn-primary min-h-12"
            >
              <FaPaperPlane aria-hidden="true" />
              Let&apos;s Work Together
            </a>
            {CV_LINK ? (
              <a
                href={CV_LINK}
                download
                className="btn-outline min-h-12 px-9"
              >
                <FaDownload aria-hidden="true" />
                Download CV
              </a>
            ) : null}
          </div>
          <ul className="flex gap-2 -ml-2.5">
            {socialIcons.map(({ id, label, Icon, socialLink }) => (
              <li key={id}>
                <m.a
                  href={socialLink}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={label}
                  title={`Talat Mahmud on ${label}`}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 grid place-items-center rounded-lg text-green-main hover:text-[#0c6532]"
                >
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </m.a>
              </li>
            ))}
          </ul>
        </div>

        <div ref={dragAreaRef} className="relative flex justify-center lg:justify-end lg:pr-[169px] order-1 lg:order-2 pt-10 lg:pt-14 lg:self-start">
          {/* drag needs the full feature set (domMax); loading it lazily delayed LCP in Lighthouse */}
          <LazyMotion features={domMax}>
          <m.div
            drag
            dragConstraints={dragAreaRef}
            dragElastic={0.5}
            dragSnapToOrigin
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            whileDrag={{ scale: 1.03 }}
            className="relative touch-none select-none cursor-grab active:cursor-grabbing w-[260px] h-[300px] sm:w-[340px] sm:h-[380px] lg:w-[350px] lg:h-[430px]">
            <DotGrid className="-left-6 sm:-left-14 top-2" />
            <DotGrid className="-right-24 top-[36%] hidden md:grid" />
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
                alt="Talat Mahmud - Full Stack Software Engineer"
                fill
                preload
                fetchPriority="high"
                placeholder="blur"
                sizes="(min-width: 640px) 350px, 260px"
                draggable={false}
                className="object-contain object-bottom pointer-events-none"
              />
            </div>
            <div className="absolute -left-6 sm:-left-16 top-[24%] bg-white-500 rounded-xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)] px-4 py-4 flex flex-col items-center text-center w-[124px]">
              <FaCode className="text-[#1a9e55] w-6 h-6 mb-2" aria-hidden="true" />
              <span className="text-xs font-medium text-[#374151] leading-tight">
                Turning Ideas Into Reality
              </span>
            </div>
            <div className="absolute -right-6 sm:-right-12 bottom-0 bg-white-500 rounded-2xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)] px-4 py-4 flex flex-col items-center text-center w-[132px]">
              <FaChartBar className="text-[#1a9e55] w-7 h-7 mb-2" aria-hidden="true" />
              <span className="text-[15px] font-extrabold text-[#111827]">{yearOfExperience || "0"}+ Years</span>
              <span className="text-xs text-[#4b5563] leading-tight">
                Building Web Solutions
              </span>
            </div>
            {/* decorative loop above the frame's top-right corner */}
            <svg aria-hidden="true" width="26" height="30" viewBox="0 0 26 30" className="absolute -top-[78px] -right-10 z-20 text-[#1a9e55] hidden md:block" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 10c0-6 12-6 12 1 0 5-8 6-8 11 0 3 4 4 7 2" />
              <circle cx="20" cy="26" r="1.5" fill="currentColor" />
            </svg>
            {/* handwritten signature beside the frame + arrow pointing back at it */}
            <div
              aria-hidden="true"
              className="absolute top-[2%] -right-[165px] z-20 text-green-main hidden md:block"
            >
              <span
                className="block -rotate-[10deg] text-[20px] leading-[1.05] font-semibold"
                style={{ fontFamily: "'Segoe Script', 'Brush Script MT', 'Lucida Handwriting', cursive" }}
              >
                Talat
                <br />
                <span className="ml-3">Mahmud</span>
              </span>
              <svg width="44" height="40" viewBox="0 0 44 40" className="ml-8 mt-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M38 3c3 16-6 28-28 31" />
                <path d="M16 27l-7 7 8 4" />
              </svg>
            </div>
          </m.div>
          </LazyMotion>
        </div>
      </div>
      </div>
    </section>
  );
}

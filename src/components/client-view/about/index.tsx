"use client";

import CountUp from "@/components/client-view/count-up";
import { m, type Variants } from "framer-motion";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import type { About } from "@/types";
import { FaUsers, FaFolder, FaStar, FaCode } from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiCss,
  SiBootstrap,
  SiTailwindcss,
  SiMui,
  SiDaisyui,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiJavascript,
  SiHtml5,
  SiNodedotjs,
  SiFirebase,
  SiTypescript,
} from "react-icons/si";
import AnimationWrapper from "../animation-wrapper";
import AboutIllustration from "./illustration";

const fadeUp: Variants = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

// skill name (lowercase, no spaces/dots) -> icon + color
const skillIcons: Record<string, [IconType, string]> = {
  reactjs: [SiReact, "#61DAFB"],
  react: [SiReact, "#61DAFB"],
  nextjs: [SiNextdotjs, "#000000"],
  next: [SiNextdotjs, "#000000"],
  redux: [SiRedux, "#764ABC"],
  css: [SiCss, "#1572B6"],
  css3: [SiCss, "#1572B6"],
  bootstrap: [SiBootstrap, "#7952B3"],
  tailwindcss: [SiTailwindcss, "#06B6D4"],
  tailwind: [SiTailwindcss, "#06B6D4"],
  materialui: [SiMui, "#007FFF"],
  mui: [SiMui, "#007FFF"],
  daisyui: [SiDaisyui, "#F2B33D"],
  expressjs: [SiExpress, "#000000"],
  express: [SiExpress, "#000000"],
  mongodb: [SiMongodb, "#47A248"],
  mysql: [SiMysql, "#4479A1"],
  javascript: [SiJavascript, "#F7DF1E"],
  js: [SiJavascript, "#F7DF1E"],
  html: [SiHtml5, "#E34F26"],
  html5: [SiHtml5, "#E34F26"],
  nodejs: [SiNodedotjs, "#339933"],
  node: [SiNodedotjs, "#339933"],
  firebase: [SiFirebase, "#FFCA28"],
  typescript: [SiTypescript, "#3178C6"],
};

function getSkillIcon(skill: string): [IconType, string] {
  const key = skill.toLowerCase().replace(/[\s.\-_]/g, "");
  return skillIcons[key] || [FaCode, "#0f7a3d"];
}

const DEFAULT_WHY_HIRE_LABEL = "WHY HIRE ME";
const DEFAULT_WHY_HIRE_HEADING = "Why Hire Me For Your Next Project ?";
const DEFAULT_WHY_HIRE_HIGHLIGHT = "Project";

// Wraps the first (case-sensitive) occurrence of highlight in a green span
function renderHighlighted(text: string, highlight: string): ReactNode {
  const index = highlight ? text.indexOf(highlight) : -1;
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-green-brand">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export default function ClientAboutView({
  data,
  projectCount,
}: {
  data?: Partial<About> | null;
  /** Live number of projects in the DB; falls back to the admin-entered value. */
  projectCount?: number;
}) {
  const whyHireLabel = data?.whyhirelabel?.trim() || DEFAULT_WHY_HIRE_LABEL;
  const whyHireHeading =
    data?.whyhireheading?.trim() || DEFAULT_WHY_HIRE_HEADING;
  const whyHireHighlight = data?.whyhirehighlight?.trim()
    ? data.whyhirehighlight.trim()
    : data?.whyhireheading?.trim()
    ? ""
    : DEFAULT_WHY_HIRE_HIGHLIGHT;
  const aboutDataInfo = [
    {
      id: 1,
      label: "Client",
      value: data?.noofclients || "0",
      text: "Happy clients worldwide",
      Icon: FaUsers,
    },
    {
      id: 2,
      label: "Projects",
      value: projectCount ? String(projectCount) : data?.noofprojects || "0",
      text: "Successful project delivered",
      Icon: FaFolder,
    },
    {
      id: 3,
      label: "Experience",
      value: data?.yearofexperience || "0",
      text: "Years of professional experience",
      Icon: FaStar,
    },
  ];

  const skills = data?.skills
    ? data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <section
      className="max-w-screen-xl pt-4 pb-16 lg:pb-24 px-6 sm:px-8 lg:px-16 mx-auto"
      id="about"
    >
      {/* Stats */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {aboutDataInfo.map(({ id, label, value, text, Icon }) => (
          <li
            key={id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white-500 rounded-2xl shadow-card border border-gray-100 p-5 sm:p-6"
          >
            <span className="w-14 h-14 shrink-0 rounded-full bg-[#e3f7ec] flex items-center justify-center">
              <Icon className="w-6 h-6 text-green-main" aria-hidden="true" />
            </span>
            <div>
              <p className="text-3xl font-extrabold text-black-600">
                <CountUp value={value} suffix="+" />
              </p>
              <p className="text-base font-bold text-black-600">{label}</p>
              <p className="text-[13px] text-black-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Why hire me */}
      <AnimationWrapper className="mt-12">
        <m.div
          variants={fadeUp}
          className="rounded-2xl bg-[#effbf4] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white-500 px-4 py-1.5 text-xs font-semibold tracking-wide text-black-600">
              <span className="w-2 h-2 rounded-full bg-green-main" />
              {whyHireLabel}
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold leading-tight text-black-600">
              {renderHighlighted(whyHireHeading, whyHireHighlight)}
            </h2>
            <p className="text-black-500 leading-7 mt-4 mb-6 max-w-[60ch]">{data?.aboutme}</p>
            <AboutIllustration />
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {skills.map((skill, i) => {
              const [SkillIcon, color] = getSkillIcon(skill);
              return (
                <li
                  key={i}
                  className="flex items-center gap-2.5 bg-white-500 rounded-full shadow-sm px-4 py-2.5 text-[13px] sm:text-sm font-semibold text-black-600 min-w-0"
                >
                  <SkillIcon
                    className="w-5 h-5 shrink-0"
                    style={{ color }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 break-words leading-tight">{skill}</span>
                </li>
              );
            })}
          </ul>
        </m.div>
      </AnimationWrapper>
    </section>
  );
}

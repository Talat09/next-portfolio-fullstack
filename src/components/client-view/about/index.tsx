"use client";

import CountUp from "@/components/client-view/count-up";
import { m, type Variants } from "framer-motion";
import type { IconType } from "react-icons";
import { useState, type ReactNode } from "react";
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
  SiChakraui,
  SiAntdesign,
  SiFastify,
  SiPostgresql,
  SiSupabase,
  SiStripe,
  SiLemonsqueezy,
  SiGooglemaps,
  SiX,
  SiClaude,
  SiGooglegemini,
} from "react-icons/si";
import { TbBrandOpenai, TbFilter, TbBolt, TbVideo, TbBuildingStore } from "react-icons/tb";
import { Blob, DotGrid, Plus, SectionDecor, Squiggle } from "../decor";
import AnimationWrapper from "../animation-wrapper";
import AboutIllustration from "./illustration";
import { sectionHeading, sectionDesc, sectionLabel } from "../typography";

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
  ts: [SiTypescript, "#3178C6"],
  chakraui: [SiChakraui, "#319795"],
  antdesign: [SiAntdesign, "#0170FE"],
  fastify: [SiFastify, "#000000"],
  postgresql: [SiPostgresql, "#4169E1"],
  postgres: [SiPostgresql, "#4169E1"],
  supabase: [SiSupabase, "#3FCF8E"],
  stripe: [SiStripe, "#635BFF"],
  lemonsqueezy: [SiLemonsqueezy, "#FFC233"],
  clickfunnels: [TbFilter, "#E2412F"],
  gohighlevel: [TbBolt, "#188BF6"],
  openai: [TbBrandOpenai, "#000000"],
  googlemaps: [SiGooglemaps, "#4285F4"],
  heygen: [TbVideo, "#7559FF"],
  googlebusinessprofile: [TbBuildingStore, "#4285F4"],
  grok: [SiX, "#000000"],
  claude: [SiClaude, "#D97757"],
  gemini: [SiGooglegemini, "#8E75B2"],
};

const INITIAL_SKILLS = 17;

function getSkillIcon(skill: string): [IconType, string] {
  const key = skill.toLowerCase().replace(/[\s.\-_]/g, "");
  // "OpenAI API" -> "openai"
  return skillIcons[key] || skillIcons[key.replace(/api$/, "")] || [FaCode, "#0f7a3d"];
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

  const [showAllSkills, setShowAllSkills] = useState(false);
  const skills = data?.skills
    ? data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const visibleSkills = showAllSkills ? skills : skills.slice(0, INITIAL_SKILLS);

  return (
    <section
      className="relative isolate max-w-screen-xl pt-4 pb-16 lg:pb-24 px-6 max-[400px]:px-4 sm:px-8 lg:px-8 xl:px-16 mx-auto"
      id="about"
    >
      <SectionDecor>
        <Blob className="-right-24 top-40 w-72 h-72 bg-[#e6f6ec]/70" />
        <Blob className="-left-16 bottom-24 w-44 h-44 bg-[#eef9f2] hidden sm:block" />
        <DotGrid className="right-[6%] top-6 hidden lg:grid" />
        <Plus className="right-[18%] bottom-10 w-5 h-5 hidden md:block" />
      </SectionDecor>
      {/* Stats */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-4 xl:gap-6">
        {aboutDataInfo.map(({ id, label, value, text, Icon }) => (
          <li
            key={id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-3 xl:gap-4 bg-white-500 rounded-2xl shadow-card border border-gray-100 p-5 sm:p-6 lg:p-4 xl:p-6"
          >
            <span className="w-14 h-14 shrink-0 rounded-full bg-[#e3f7ec] flex items-center justify-center">
              <Icon className="w-6 h-6 text-green-main" aria-hidden="true" />
            </span>
            <div>
              <p className="text-3xl font-extrabold text-black-600">
                <CountUp value={value} suffix="+" />
              </p>
              <p className="text-base font-bold text-black-600">{label}</p>
              <p className="text-[13px] lg:text-xs xl:text-[13px] text-black-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Why hire me */}
      <AnimationWrapper className="mt-12">
        <m.div
          variants={fadeUp}
          className="relative isolate overflow-hidden rounded-2xl bg-[#effbf4] p-6 max-[400px]:p-4 sm:p-10 lg:p-8 xl:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 xl:gap-10 items-center"
        >
          <SectionDecor contained>
            <Blob className="-right-20 -top-20 w-64 h-64 bg-white-500/60" />
            <Blob className="-left-10 -bottom-12 w-40 h-40 bg-[#e3f7ec]" />
            <Squiggle className="right-8 top-8 w-24 hidden sm:block" />
            <DotGrid className="right-6 bottom-6 hidden lg:grid" />
          </SectionDecor>
          <div>
            <span className={`${sectionLabel} bg-white-500`}>
              <span className="w-2 h-2 rounded-full bg-green-main" />
              {whyHireLabel}
            </span>
            <h2 className={`${sectionHeading} mt-4`}>
              {renderHighlighted(whyHireHeading, whyHireHighlight)}
            </h2>
            <p className={`${sectionDesc} mt-4 mb-6 max-w-[60ch]`}>{data?.aboutme}</p>
            <AboutIllustration />
          </div>
          {/* lg: line the skills up with the illustration, not the heading */}
          <div className="lg:self-end lg:pb-10">
          <ul id="skills-list" className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-[400px]:gap-2 lg:gap-3 xl:gap-4">
            {visibleSkills.map((skill, i) => {
              const [SkillIcon, color] = getSkillIcon(skill);
              return (
                <li
                  key={i}
                  className="flex items-center gap-2.5 max-[400px]:gap-1.5 lg:gap-2 xl:gap-2.5 bg-white-500 rounded-full shadow-sm px-4 max-[400px]:px-2.5 lg:px-3 xl:px-4 py-2.5 text-[13px] max-[400px]:text-[11px] sm:text-sm lg:text-[13px] xl:text-sm font-semibold text-black-600 min-w-0"
                >
                  <SkillIcon
                    className="w-5 h-5 max-[400px]:w-4 max-[400px]:h-4 shrink-0"
                    style={{ color }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 break-words max-[400px]:whitespace-nowrap leading-tight">{skill}</span>
                </li>
              );
            })}
            {skills.length > INITIAL_SKILLS && (
              <li className="flex min-w-0">
                <button
                  type="button"
                  onClick={() => setShowAllSkills((v) => !v)}
                  aria-expanded={showAllSkills}
                  aria-controls="skills-list"
                  className="w-full min-h-11 rounded-full border border-green-main bg-white-500 px-4 max-[400px]:px-2 lg:px-3 xl:px-4 py-2.5 text-[13px] max-[400px]:text-[11px] max-[400px]:whitespace-nowrap sm:text-sm lg:text-[13px] xl:text-sm font-semibold text-green-main transition-colors hover:bg-green-main hover:text-white-500"
                >
                  {showAllSkills ? "Show less" : `Show more (+${skills.length - INITIAL_SKILLS})`}
                </button>
              </li>
            )}
          </ul>
          </div>
        </m.div>
      </AnimationWrapper>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaUsers, FaFolder, FaStar, FaCode } from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiCss3,
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
import aboutIllustration from "@/assets/1.gif";

const fadeUp = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

// skill name (lowercase, no spaces/dots) -> icon + color
const skillIcons = {
  reactjs: [SiReact, "#61DAFB"],
  react: [SiReact, "#61DAFB"],
  nextjs: [SiNextdotjs, "#000000"],
  next: [SiNextdotjs, "#000000"],
  redux: [SiRedux, "#764ABC"],
  css: [SiCss3, "#1572B6"],
  css3: [SiCss3, "#1572B6"],
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

function getSkillIcon(skill) {
  const key = skill.toLowerCase().replace(/[\s.\-_]/g, "");
  return skillIcons[key] || [FaCode, "#0DB760"];
}

export default function ClientAboutView({ data }) {
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
      value: data?.noofprojects || "0",
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
      className="max-w-screen-xl mt-10 mb-6 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="about"
    >
      {/* Stats */}
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {aboutDataInfo.map(({ id, label, value, text, Icon }) => (
          <li
            key={id}
            className="flex items-center gap-4 bg-white-500 rounded-2xl shadow-md border border-gray-100 p-6"
          >
            <span className="w-14 h-14 shrink-0 rounded-full bg-[#e3f7ec] flex items-center justify-center">
              <Icon className="w-6 h-6 text-green-main" aria-hidden="true" />
            </span>
            <div>
              <p className="text-3xl font-extrabold text-black-600">{value}+</p>
              <p className="text-base font-bold text-black-600">{label}</p>
              <p className="text-xs text-black-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Why hire me */}
      <AnimationWrapper className="mt-12">
        <motion.div
          variants={fadeUp}
          className="rounded-3xl bg-[#effbf4] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white-500 px-4 py-1.5 text-xs font-semibold text-black-600">
              <span className="w-2 h-2 rounded-full bg-green-main" />
              WHY HIRE ME
            </span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-extrabold leading-tight text-black-600">
              Why Hire Me For Your Next{" "}
              <span className="text-green-main">Project</span> ?
            </h2>
            <p className="text-black-500 mt-4 mb-6">{data?.aboutme}</p>
            <Image
              src={aboutIllustration}
              alt="Developer working at a desk illustration"
              unoptimized
              className="w-full max-w-[420px] h-auto"
            />
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {skills.map((skill, i) => {
              const [SkillIcon, color] = getSkillIcon(skill);
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-white-500 rounded-xl shadow-sm px-4 py-3 text-sm font-semibold text-black-600 overflow-hidden"
                >
                  <SkillIcon
                    className="w-5 h-5 shrink-0"
                    style={{ color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{skill}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </AnimationWrapper>
    </section>
  );
}

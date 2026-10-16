"use client";
import { m, type Variants } from "framer-motion";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import type { Education, Experience } from "@/types";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";
import AnimationWrapper from "../animation-wrapper";

const fadeUp: Variants = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7ec] px-4 py-1.5 text-xs font-semibold text-black-600">
      <span className="w-2 h-2 rounded-full bg-green-main" />
      {children}
    </span>
  );
}

function SectionHeading({ first, highlight }: { first: string; highlight: string }) {
  return (
    <h2 className="mt-3 mb-6 text-4xl lg:text-5xl font-extrabold text-black-600">
      {first} <span className="text-green-brand">{highlight}</span>
    </h2>
  );
}

function TimelineList({ children }: { children: ReactNode }) {
  return (
    <ol className="relative border-l-2 border-green-main ml-2 sm:ml-3 space-y-6">
      {children}
    </ol>
  );
}

function TimelineCard({
  Icon,
  children,
  tag,
}: {
  Icon: IconType;
  children: ReactNode;
  tag?: string;
}) {
  return (
    <li className="relative pl-6 sm:pl-8">
      <span
        aria-hidden="true"
        className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-green-main ring-4 ring-[#e3f7ec]"
      />
      <div className="bg-white-500 rounded-2xl shadow-card border border-gray-100 p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
        <span className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[#e3f7ec] flex items-center justify-center">
          <Icon className="w-5 h-5 text-green-main" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          {tag ? (
            <span className="sm:hidden mb-1.5 inline-block rounded-full bg-green-tint text-green-main text-xs font-semibold px-2.5 py-0.5">
              {tag}
            </span>
          ) : null}
          {children}
        </div>
        {tag ? (
          <span className="hidden sm:inline-block shrink-0 rounded-full bg-green-tint text-green-main text-xs font-semibold px-3 py-1">
            {tag}
          </span>
        ) : null}
      </div>
    </li>
  );
}

export default function ClientExperienceAndEducationView({
  educationData,
  experienceData,
}: {
  educationData?: Education[];
  experienceData?: Experience[];
}) {
  return (
    <section
      className="max-w-screen-xl py-16 lg:py-24 px-6 sm:px-8 lg:px-16 mx-auto"
      id="experience"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimationWrapper>
          <m.div variants={fadeUp}>
            <Pill>MY JOURNEY</Pill>
            <SectionHeading first="My" highlight="Experience" />
            <TimelineList>
              {experienceData && experienceData.length
                ? experienceData.map((experienceItem, i) => (
                    <TimelineCard
                      key={experienceItem._id || i}
                      Icon={FaBuilding}
                      tag={experienceItem.jobprofile}
                    >
                      <p className="text-[13px] text-black-500">
                        {experienceItem.duration}
                      </p>
                      <h3 className="font-bold text-black-600 mt-1">
                        {experienceItem.company}
                        {experienceItem.location
                          ? `, ${experienceItem.location}`
                          : ""}
                      </h3>
                      <p className="text-sm font-semibold text-black-500 mt-1">
                        {experienceItem.position}
                      </p>
                    </TimelineCard>
                  ))
                : null}
            </TimelineList>
          </m.div>
        </AnimationWrapper>

        <AnimationWrapper>
          <m.div variants={fadeUp}>
            <Pill>MY ACADEMIC BACKGROUND</Pill>
            <SectionHeading first="My" highlight="Education" />
            <TimelineList>
              {educationData && educationData.length
                ? educationData.map((educationItem, i) => (
                    <TimelineCard
                      key={educationItem._id || i}
                      Icon={FaGraduationCap}
                    >
                      <p className="text-[13px] text-black-500">
                        {educationItem.year}
                      </p>
                      <h3 className="font-bold text-black-600 mt-1">
                        {educationItem.college}
                      </h3>
                      <p className="text-sm font-semibold text-black-500 mt-1">
                        {educationItem.degree}
                      </p>
                    </TimelineCard>
                  ))
                : null}
            </TimelineList>
          </m.div>
        </AnimationWrapper>
      </div>
    </section>
  );
}

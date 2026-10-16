"use client";
import { motion } from "framer-motion";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";
import AnimationWrapper from "../animation-wrapper";

const fadeUp = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7ec] px-4 py-1.5 text-xs font-semibold text-black-600">
      <span className="w-2 h-2 rounded-full bg-green-main" />
      {children}
    </span>
  );
}

function SectionHeading({ first, highlight }) {
  return (
    <h2 className="mt-3 mb-6 text-3xl lg:text-4xl font-extrabold text-black-600">
      {first} <span className="text-green-main">{highlight}</span>
    </h2>
  );
}

function TimelineList({ children }) {
  return (
    <ol className="relative border-l-2 border-green-main ml-3 space-y-6">
      {children}
    </ol>
  );
}

function TimelineCard({ Icon, children, tag }) {
  return (
    <li className="relative pl-8">
      <span
        aria-hidden="true"
        className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-green-main ring-4 ring-[#e3f7ec]"
      />
      <div className="bg-white-500 rounded-2xl shadow-md border border-gray-100 p-5 flex gap-4 items-start">
        <span className="w-11 h-11 shrink-0 rounded-xl bg-[#e3f7ec] flex items-center justify-center">
          <Icon className="w-5 h-5 text-green-main" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">{children}</div>
        {tag ? (
          <span className="shrink-0 rounded-full bg-[#e3f7ec] text-green-main text-xs font-semibold px-3 py-1">
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
}) {
  return (
    <section
      className="max-w-screen-xl mt-16 mb-6 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="experience"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimationWrapper>
          <motion.div variants={fadeUp}>
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
                      <p className="text-xs text-black-500">
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
          </motion.div>
        </AnimationWrapper>

        <AnimationWrapper>
          <motion.div variants={fadeUp}>
            <Pill>MY ACADEMIC BACKGROUND</Pill>
            <SectionHeading first="My" highlight="Education" />
            <TimelineList>
              {educationData && educationData.length
                ? educationData.map((educationItem, i) => (
                    <TimelineCard
                      key={educationItem._id || i}
                      Icon={FaGraduationCap}
                    >
                      <p className="text-xs text-black-500">
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
          </motion.div>
        </AnimationWrapper>
      </div>
    </section>
  );
}

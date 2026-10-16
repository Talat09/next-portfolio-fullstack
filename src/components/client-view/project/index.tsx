"use client";
import { useState } from "react";
import { m, type Variants } from "framer-motion";
import { scroller } from "react-scroll";
import { scrollDuration } from "@/lib/motion";
import type { Project } from "@/types";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import { Blob, DotGrid, Plus, SectionDecor } from "../decor";
import AnimationWrapper from "../animation-wrapper";
import ProjectCard from "../project-card";
import { sortByOrderThenUpdated } from "@/lib/sort";
import { sectionHeading, sectionLabel } from "../typography";

// How many projects are shown before "View All Projects" is clicked
const INITIAL_COUNT = 4;

const fadeUp: Variants = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

export default function ClientProjectView({ data }: { data?: Project[] }) {
  const [showAll, setShowAll] = useState(false);
  const projects = sortByOrderThenUpdated(data);
  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_COUNT);

  function toggleShowAll() {
    if (showAll) {
      setShowAll(false);
      scroller.scrollTo("projects", {
        duration: scrollDuration(800),
        smooth: true,
        offset: -80,
      });
    } else {
      setShowAll(true);
    }
  }

  return (
    <section
      className="relative isolate max-w-screen-xl py-16 lg:py-24 px-6 max-[400px]:px-4 sm:px-8 lg:px-8 xl:px-16 mx-auto"
      id="projects"
    >
      <SectionDecor>
        <Blob className="-right-28 top-16 w-72 h-72 bg-[#e6f6ec]/70" />
        <Blob className="-left-20 bottom-0 w-56 h-56 bg-[#eef9f2] hidden sm:block" />
        <DotGrid className="left-[3%] top-12 hidden lg:grid" />
        <Plus className="left-[42%] top-14 w-5 h-5 hidden md:block" />
      </SectionDecor>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className={`${sectionLabel} bg-[#e3f7ec]`}>
            <span className="w-2 h-2 rounded-full bg-green-main" />
            MY WORK
          </span>
          <h2 className={`${sectionHeading} mt-3`}>
            My <span className="text-green-brand">Projects</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleShowAll}
          aria-expanded={showAll}
          aria-controls="projects-list"
          className="btn-outline px-4 text-sm"
        >
          {showAll ? (
            <>
              Show Less <FaArrowUp aria-hidden="true" />
            </>
          ) : (
            <>
              View All Projects <FaArrowRight aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      <AnimationWrapper>
        <m.ul
          id="projects-list"
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 xl:gap-6"
        >
          {visibleProjects.map((item) => (
            <ProjectCard key={item._id || item.name} item={item} />
          ))}
        </m.ul>
      </AnimationWrapper>
    </section>
  );
}

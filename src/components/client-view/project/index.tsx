"use client";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { scroller } from "react-scroll";
import { scrollDuration } from "@/lib/motion";
import type { Project } from "@/types";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import AnimationWrapper from "../animation-wrapper";
import ProjectCard from "../project-card";
import { sortByOrderThenUpdated } from "@/lib/sort";

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
      className="max-w-screen-xl py-16 lg:py-24 px-6 sm:px-8 lg:px-16 mx-auto"
      id="projects"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7ec] px-4 py-1.5 text-xs font-semibold text-black-600">
            <span className="w-2 h-2 rounded-full bg-green-main" />
            MY WORK
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-black-600">
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
        <motion.ul
          id="projects-list"
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {visibleProjects.map((item) => (
            <ProjectCard key={item._id || item.name} item={item} />
          ))}
        </motion.ul>
      </AnimationWrapper>
    </section>
  );
}

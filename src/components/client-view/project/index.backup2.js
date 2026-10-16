"use client";
import { motion } from "framer-motion";
import { FaArrowRight, FaGlobe, FaGithub } from "react-icons/fa";
import AnimationWrapper from "../animation-wrapper";

// TODO: change if you add a dedicated "all projects" page
const ALL_PROJECTS_LINK = "https://github.com/Talat09?tab=repositories";

const fadeUp = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

export default function ClientProjectView({ data }) {
  return (
    <section
      className="max-w-screen-xl mt-16 mb-6 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="projects"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7ec] px-4 py-1.5 text-xs font-semibold text-black-600">
            <span className="w-2 h-2 rounded-full bg-green-main" />
            MY WORK
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-black-600">
            My <span className="text-green-main">Projects</span>
          </h2>
        </div>
        <a
          href={ALL_PROJECTS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-2 px-4 border-2 border-green-main text-green-main rounded-lg text-sm font-semibold hover:bg-[#e3f7ec] transition-all"
        >
          View All Projects <FaArrowRight aria-hidden="true" />
        </a>
      </div>
      <AnimationWrapper>
        <motion.ul
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {data && data.length
            ? data.map((item) => (
                <li
                  key={item._id || item.name}
                  className="bg-white-500 rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col"
                >
                  <h3 className="text-lg text-black-600 capitalize font-extrabold">
                    {item.name}
                  </h3>
                  <p className="text-xs mt-1 text-black-500">
                    {item.createdAt ? item.createdAt.split("T")[0] : null}
                  </p>
                  <ul className="flex flex-wrap gap-2 mt-4 mb-5">
                    {item?.technologies
                      ?.split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((techItem, i) => (
                        <li
                          key={i}
                          className="rounded-md bg-[#effbf4] text-black-600 text-xs font-medium px-2.5 py-1"
                        >
                          {techItem}
                        </li>
                      ))}
                  </ul>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 bg-green-main text-white-500 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
                    >
                      <FaGlobe aria-hidden="true" /> Website
                    </a>
                    {item.github ? (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 border-2 border-green-main text-black-600 rounded-lg text-xs font-semibold hover:bg-[#e3f7ec] transition-all"
                    >
                      <FaGithub aria-hidden="true" /> Github
                    </a>
                    ) : null}
                  </div>
                </li>
              ))
            : null}
        </motion.ul>
      </AnimationWrapper>
    </section>
  );
}

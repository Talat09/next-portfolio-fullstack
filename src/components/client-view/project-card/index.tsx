import { FaGlobe, FaGithub, FaCode } from "react-icons/fa";
import type { Project } from "@/types";

/** Shared project card used on the homepage and on /projects */
export default function ProjectCard({ item }: { item: Project }) {
  return (
    <li
      data-project-card
      className="bg-white-500 rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col"
    >
      {/* simple coloured header until project images are added */}
      <div
        aria-hidden="true"
        className="-mx-5 -mt-5 mb-4 h-24 rounded-t-2xl bg-green-tint flex items-center justify-center"
      >
        <span className="w-12 h-12 rounded-xl bg-white-500 shadow-card flex items-center justify-center">
          <FaCode className="w-6 h-6 text-green-main" />
        </span>
      </div>
      <h3 className="text-lg text-black-600 capitalize font-extrabold">
        {item.name}
      </h3>
      <p className="text-[13px] mt-1 text-black-500">
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
              className="rounded-full bg-[#effbf4] text-black-600 text-xs font-medium px-2.5 py-1"
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
          className="btn-primary min-h-11 px-2 gap-1.5 text-[13px] shadow-none"
        >
          <FaGlobe aria-hidden="true" /> Website
        </a>
        {item.github ? (
          <a
            href={item.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline min-h-11 px-2 gap-1.5 text-[13px]"
          >
            <FaGithub aria-hidden="true" /> Github
          </a>
        ) : null}
      </div>
    </li>
  );
}

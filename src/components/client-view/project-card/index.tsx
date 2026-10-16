import { FaGlobe, FaGithub } from "react-icons/fa";
import type { Project } from "@/types";

/** Shared project card used on the homepage and on /projects */
export default function ProjectCard({ item }: { item: Project }) {
  return (
    <li
      data-project-card
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
  );
}

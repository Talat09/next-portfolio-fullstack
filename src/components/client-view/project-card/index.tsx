import Link from "next/link";
import { FaGlobe, FaGithub, FaCode, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import type { Project } from "@/types";
import { isCloudinary, projectPath } from "@/lib/project";

/** Project card used in the homepage projects grid */
export default function ProjectCard({ item, slug }: { item: Project; slug: string }) {
  return (
    <li
      data-project-card
      className="group bg-white-500 rounded-2xl shadow-card border border-gray-100 p-5 lg:p-4 xl:p-5 flex flex-col"
    >
      {item.image ? (
        <div className="relative -mx-5 -mt-5 lg:-mx-4 lg:-mt-4 xl:-mx-5 xl:-mt-5 mb-4 aspect-[16/9] overflow-hidden rounded-t-2xl bg-green-tint">
          <Image
            src={item.image}
            alt={`${item.name} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={!isCloudinary(item.image)}
            className="object-cover object-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-110 group-focus-within:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      ) : (
      <div
        aria-hidden="true"
        className="-mx-5 -mt-5 lg:-mx-4 lg:-mt-4 xl:-mx-5 xl:-mt-5 mb-4 h-24 rounded-t-2xl bg-green-tint flex items-center justify-center"
      >
        <span className="w-12 h-12 rounded-xl bg-white-500 shadow-card flex items-center justify-center">
          <FaCode className="w-6 h-6 text-green-main" />
        </span>
      </div>
      )}
      <h3 className="text-lg lg:text-base xl:text-lg text-black-600 capitalize font-extrabold">
        {item.name}
      </h3>
      {item.tagline ? (
        <p className="mt-1 text-sm font-semibold text-green-main">{item.tagline}</p>
      ) : null}
      <p className="text-[13px] mt-1 text-black-500">
        {item.createdAt ? item.createdAt.split("T")[0] : null}
      </p>
      {item.description ? (
        <p className="mt-3 text-sm leading-6 text-black-500 line-clamp-3 whitespace-pre-line">
          {item.description}
        </p>
      ) : null}
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
      <div className="mt-auto flex flex-wrap gap-2">
        <a
          href={item.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 min-w-20 min-h-11 px-2 gap-1.5 text-[13px] shadow-none whitespace-nowrap"
        >
          <FaGlobe aria-hidden="true" /> Website
        </a>
        {item.github ? (
          <a
            href={item.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex-1 min-w-20 min-h-11 px-2 gap-1.5 text-[13px] whitespace-nowrap"
          >
            <FaGithub aria-hidden="true" /> Github
          </a>
        ) : null}
        {slug ? (
          <Link
            href={projectPath(slug)}
            aria-label={`View details: ${item.name}`}
            className="btn-outline flex-1 min-w-20 min-h-11 px-2 gap-1.5 text-[13px] whitespace-nowrap"
          >
            Details <FaArrowRight aria-hidden="true" className="w-3 h-3" />
          </Link>
        ) : null}
      </div>
    </li>
  );
}

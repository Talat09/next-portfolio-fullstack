import { FaGlobe, FaGithub, FaCode } from "react-icons/fa";
import Image from "next/image";
import type { Project } from "@/types";

/** Cloudinary images go through next/image optimisation; other hosts are shown as-is. */
function isCloudinary(url: string): boolean {
  try {
    return new URL(url).hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

/** Shared project card used on the homepage and on /projects */
export default function ProjectCard({ item }: { item: Project }) {
  return (
    <li
      data-project-card
      className="group bg-white-500 rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col"
    >
      {item.image ? (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden rounded-t-2xl bg-green-tint">
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
        className="-mx-5 -mt-5 mb-4 h-24 rounded-t-2xl bg-green-tint flex items-center justify-center"
      >
        <span className="w-12 h-12 rounded-xl bg-white-500 shadow-card flex items-center justify-center">
          <FaCode className="w-6 h-6 text-green-main" />
        </span>
      </div>
      )}
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

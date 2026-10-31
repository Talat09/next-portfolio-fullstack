"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaGlobe, FaGithub, FaTimes, FaCheckCircle } from "react-icons/fa";
import type { Project } from "@/types";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Accessible dialog with a project's full details (lazy-loaded from the card). */
export default function ProjectDetailsModal({
  item,
  onClose,
}: {
  item: Project;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `project-dialog-title-${item._id || item.name.replace(/\W+/g, "-")}`;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const features = (item.keyFeatures || "")
    .split("\n")
    .map((l) => l.replace(/^[-*\u2022]\s*/, "").trim())
    .filter(Boolean);
  const tech = (item.technologies || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: "rgba(17, 24, 39, 0.55)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain bg-white-500 rounded-t-2xl sm:rounded-2xl shadow-card p-5 sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-black-500 hover:bg-green-tint hover:text-green-main transition-colors"
        >
          <FaTimes aria-hidden="true" />
        </button>
        <h2
          id={titleId}
          className="pr-12 text-xl sm:text-2xl font-extrabold capitalize text-black-600"
        >
          {item.name}
        </h2>
        {item.tagline ? (
          <p className="mt-1 text-sm sm:text-base font-semibold text-green-main">
            {item.tagline}
          </p>
        ) : null}
        {item.description ? (
          <p className="mt-4 text-sm sm:text-base leading-7 text-black-500 whitespace-pre-line">
            {item.description}
          </p>
        ) : null}
        {features.length ? (
          <>
            <h3 className="mt-6 text-base font-bold text-black-600">Key features</h3>
            <ul className="mt-3 grid gap-2.5">
              {features.map((f, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-6 text-black-500">
                  <FaCheckCircle aria-hidden="true" className="mt-1 shrink-0 text-green-main" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {tech.length ? (
          <>
            <h3 className="mt-6 text-base font-bold text-black-600">Technologies</h3>
            <ul className="flex flex-wrap gap-2 mt-3">
              {tech.map((t, i) => (
                <li
                  key={i}
                  className="rounded-full bg-[#effbf4] text-black-600 text-xs font-medium px-2.5 py-1"
                >
                  {t}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <div className="mt-6 grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
          {item.website ? (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary min-h-11 px-2 gap-1.5 text-[13px] shadow-none"
            >
              <FaGlobe aria-hidden="true" /> Live site
            </a>
          ) : null}
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
      </div>
    </div>,
    document.body
  );
}
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaCode, FaGithub, FaGlobe } from "react-icons/fa";
import type { Project } from "@/types";
import { getSectionData } from "@/lib/data";
import { sortByOrderThenUpdated } from "@/lib/sort";
import { PERSON_NAME, serializeJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  buildProjectSlugs,
  isCloudinary,
  projectPath,
  splitFeatures,
  splitTech,
  summarize,
} from "@/lib/project";
import { Footer } from "@/components/client-view/footer";
import { sectionDesc, sectionHeading, sectionLabel } from "@/components/client-view/typography";

// ISR: rebuilt at most hourly, and right after admin edits (revalidatePortfolio).
export const revalidate = 3600;
// Projects added later in admin get a page on first visit, no redeploy needed.
export const dynamicParams = true;

type Params = { slug: string };

async function loadProjects() {
  const projects = sortByOrderThenUpdated((await getSectionData<Project>("project")) ?? []);
  const slugs = buildProjectSlugs(projects);
  return { projects, slugs };
}

async function findProject(slug: string) {
  const { projects, slugs } = await loadProjects();
  const project = projects.find((p) => slugs.get(p._id || p.name) === slug);
  return { project, projects, slugs };
}

export async function generateStaticParams(): Promise<Params[]> {
  const { slugs } = await loadProjects();
  return Array.from(slugs.values()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await findProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  const title = `${project.name} \u2014 ${project.tagline || "Project"}`;
  const description = summarize(
    project.description ||
      project.tagline ||
      `${project.name}, a project built by ${PERSON_NAME}.`
  );
  const url = projectPath(slug);
  const images = project.image ? [{ url: project.image, alt: `${project.name} screenshot` }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${title} | ${PERSON_NAME}`,
      description,
      url,
      siteName: `${PERSON_NAME} Portfolio`,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${PERSON_NAME}`,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { project, projects, slugs } = await findProject(slug);
  if (!project) notFound();

  const base = siteConfig.siteUrl;
  const url = `${base}${projectPath(slug)}`;
  const tech = splitTech(project.technologies);
  const features = splitFeatures(project.keyFeatures);
  const others = projects
    .filter((p) => p !== project)
    .sort((a, b) => Number(Boolean(b.tagline)) - Number(Boolean(a.tagline)))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: project.name,
        url,
        ...(project.tagline ? { headline: project.tagline } : {}),
        ...(project.description ? { description: project.description } : {}),
        ...(project.image ? { image: project.image } : {}),
        ...(tech.length ? { keywords: tech.join(", ") } : {}),
        ...(project.website ? { sameAs: project.website } : {}),
        ...(project.createdAt ? { dateCreated: project.createdAt } : {}),
        ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
        author: { "@id": `${base}#person` },
        creator: { "@id": `${base}#person` },
        isPartOf: { "@id": `${base}#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${base}/#projects` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main
        id="main"
        tabIndex={-1}
        className="outline-none max-w-screen-lg mx-auto px-6 max-[400px]:px-4 sm:px-8 pt-8 pb-16 lg:pb-24"
      >
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/#projects"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-green-main hover:underline"
          >
            <FaArrowLeft aria-hidden="true" /> Back to projects
          </Link>
          <Link href="/" className="text-sm font-extrabold text-black-600">
            {PERSON_NAME}
          </Link>
        </nav>

        <header className="mt-6">
          <span className={`${sectionLabel} bg-[#e3f7ec]`}>
            <span className="w-2 h-2 rounded-full bg-green-main" />
            PROJECT
          </span>
          <h1 className={`${sectionHeading} mt-3 capitalize`}>{project.name}</h1>
          {project.tagline ? (
            <p className="mt-3 text-lg max-[400px]:text-base font-semibold text-green-main">
              {project.tagline}
            </p>
          ) : null}
        </header>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-gray-100 shadow-card bg-green-tint">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name} screenshot`}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              unoptimized={!isCloudinary(project.image)}
              className="object-cover object-top"
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <FaCode className="w-12 h-12 text-green-main" />
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {project.description ? (
              <section aria-labelledby="overview">
                <h2 id="overview" className="text-xl font-extrabold text-black-600">Overview</h2>
                <p className={`${sectionDesc} mt-3 whitespace-pre-line`}>{project.description}</p>
              </section>
            ) : null}
            {features.length ? (
              <section aria-labelledby="features" className="mt-8">
                <h2 id="features" className="text-xl font-extrabold text-black-600">Key features</h2>
                <ul className="mt-4 grid gap-3">
                  {features.map((f, i) => (
                    <li key={i} className={`${sectionDesc} flex gap-3`}>
                      <FaCheckCircle aria-hidden="true" className="mt-1.5 shrink-0 text-green-main" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="rounded-2xl bg-white-500 border border-gray-100 shadow-card p-5 h-fit">
            {tech.length ? (
              <>
                <h2 className="text-base font-bold text-black-600">Technologies</h2>
                <ul className="flex flex-wrap gap-2 mt-3">
                  {tech.map((t, i) => (
                    <li key={i} className="rounded-full bg-[#effbf4] text-black-600 text-xs font-medium px-2.5 py-1">
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {project.website ? (
                <a href={project.website} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 min-w-28 min-h-11 px-3 gap-1.5 text-[13px] shadow-none">
                  <FaGlobe aria-hidden="true" /> Live site
                </a>
              ) : null}
              {project.github ? (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 min-w-28 min-h-11 px-3 gap-1.5 text-[13px]">
                  <FaGithub aria-hidden="true" /> Github
                </a>
              ) : null}
            </div>
            <p className="mt-5 text-sm text-black-500">
              Built by{" "}
              <Link href="/" className="font-semibold text-green-main hover:underline">
                {PERSON_NAME}
              </Link>
            </p>
          </aside>
        </div>

        {others.length ? (
          <section aria-labelledby="other-projects" className="mt-14">
            <h2 id="other-projects" className="text-xl font-extrabold text-black-600">Other projects</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {others.map((p) => (
                <li key={p._id || p.name}>
                  <Link
                    href={projectPath(slugs.get(p._id || p.name) || "")}
                    className="group flex h-full flex-col rounded-2xl bg-white-500 border border-gray-100 shadow-card p-4 hover:border-green-main transition-colors"
                  >
                    <span className="font-extrabold text-black-600 capitalize">{p.name}</span>
                    {p.tagline ? <span className="mt-1 text-sm text-black-500 line-clamp-2">{p.tagline}</span> : null}
                    <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-main">
                      View project <FaArrowRight aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
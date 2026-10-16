import ClientHomeView from "@/components/client-view/home";
import ClientAboutView from "@/components/client-view/about";
import ClientContactView from "@/components/client-view/contact";
import ClientExperienceAndEducationView from "@/components/client-view/experience";

import ClientProjectView from "@/components/client-view/project";
import { Footer } from "@/components/client-view/footer";
import type {
  About,
  ContactInfo,
  Education,
  Experience,
  Home as HomeDoc,
  Project,
} from "@/types";
import { getSectionData } from "@/lib/data";
import { buildJsonLd, serializeJsonLd } from "@/lib/seo";
import profileImage from "@/assets/Talat-Mahmud-image.png";

// Cached (ISR): rebuilt at most once an hour, and immediately after any admin
// change (admin routes call revalidatePortfolio()). Contact messages are never read here.
export const revalidate = 3600;

export default async function Home() {
  // Load all sections in parallel; each one is null when the database is unavailable.
  const results = await Promise.all([
    getSectionData<HomeDoc>("home"),
    getSectionData<About>("about"),
    getSectionData<Experience>("experience"),
    getSectionData<Education>("education"),
    getSectionData<Project>("project"),
    getSectionData<ContactInfo>("contact-info"),
  ]);
  // At runtime, fail the regeneration instead of caching an empty page for an hour:
  // Next.js then keeps serving the last good version. During `next build` without a
  // database, render the empty fallback so the build still succeeds.
  if (
    results.every((r) => r === null) &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    throw new Error("Portfolio data is temporarily unavailable");
  }
  const [
    homeSectionData,
    aboutSectionData,
    experienceSectionData,
    educationSectionData,
    projectSectionData,
    contactInfoSectionData,
  ] = results.map((r) => r ?? undefined) as [
    HomeDoc[] | undefined,
    About[] | undefined,
    Experience[] | undefined,
    Education[] | undefined,
    Project[] | undefined,
    ContactInfo[] | undefined,
  ];
  const jsonLd = buildJsonLd({
    about: aboutSectionData?.[0] ?? null,
    experience: experienceSectionData,
    education: educationSectionData,
    contactInfo: contactInfoSectionData?.[0] ?? null,
    imagePath: profileImage.src,
  });
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main id="main" tabIndex={-1} className="outline-none">
      <ClientHomeView
        data={homeSectionData}
        yearOfExperience={
          aboutSectionData && aboutSectionData.length
            ? aboutSectionData[0]?.yearofexperience
            : null
        }
      />
      <ClientAboutView
        data={
          aboutSectionData && aboutSectionData.length ? aboutSectionData[0] : null
        }
        projectCount={projectSectionData?.length}
      />
      <ClientExperienceAndEducationView
        educationData={educationSectionData}
        experienceData={experienceSectionData}
      />
      <ClientProjectView data={projectSectionData} />
      <ClientContactView
        data={
          contactInfoSectionData && contactInfoSectionData.length
            ? contactInfoSectionData[0]
            : null
        }
      />
      </main>
      <Footer />
    </div>
  );
}

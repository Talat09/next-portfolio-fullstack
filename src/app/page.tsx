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
  SectionTab,
} from "@/types";
import { getSectionData } from "@/lib/data";
import { buildJsonLd, serializeJsonLd } from "@/lib/seo";
import profileImage from "@/assets/Talat-Mahmud-image.png";

// Always render with fresh data from the database (same as the old no-store fetch).
export const dynamic = "force-dynamic";

async function extractAllDatas<T>(
  currentSection: SectionTab
): Promise<T[] | undefined> {
  if (currentSection === "contact") return undefined; // messages are private
  return (await getSectionData<T>(currentSection)) ?? undefined;
}
export default async function Home() {
  // Load all sections in parallel; each one falls back to empty on failure.
  const [
    homeSectionData,
    aboutSectionData,
    experienceSectionData,
    educationSectionData,
    projectSectionData,
    contactInfoSectionData,
  ] = await Promise.all([
    extractAllDatas<HomeDoc>("home"),
    extractAllDatas<About>("about"),
    extractAllDatas<Experience>("experience"),
    extractAllDatas<Education>("education"),
    extractAllDatas<Project>("project"),
    extractAllDatas<ContactInfo>("contact-info"),
  ]);
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
      <Footer />
    </div>
  );
}

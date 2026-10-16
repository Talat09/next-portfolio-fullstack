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

// Always render with fresh data from the database (same as the old no-store fetch).
export const dynamic = "force-dynamic";

async function extractAllDatas<T>(
  currentSection: SectionTab
): Promise<T[] | undefined> {
  if (currentSection === "contact") return undefined; // messages are private
  return (await getSectionData<T>(currentSection)) ?? undefined;
}
export default async function Home() {
  const homeSectionData = await extractAllDatas<HomeDoc>("home");
  const aboutSectionData = await extractAllDatas<About>("about");
  const experienceSectionData = await extractAllDatas<Experience>("experience");
  const educationSectionData = await extractAllDatas<Education>("education");
  const projectSectionData = await extractAllDatas<Project>("project");
  const contactInfoSectionData = await extractAllDatas<ContactInfo>("contact-info");
  return (
    <div>
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

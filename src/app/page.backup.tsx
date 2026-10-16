import ClientHomeView from "@/components/client-view/home";
import ClientAboutView from "@/components/client-view/about";
import ClientContactView from "@/components/client-view/contact";
import ClientExperienceAndEducationView from "@/components/client-view/experience";

import ClientProjectView from "@/components/client-view/project";
import { Footer } from "@/components/client-view/footer";
import type {
  About,
  ApiResponse,
  ContactInfo,
  Education,
  Experience,
  Home as HomeDoc,
  Project,
  SectionTab,
} from "@/types";
//https://talat-mahmud-portfolio.vercel.app
//http://localhost:3000
async function extractAllDatas<T>(
  currentSection: SectionTab
): Promise<T[] | undefined> {
  try {
    const res = await fetch(
      `https://talat-mahmud-portfolio.vercel.app/api/${currentSection}/get`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const data: ApiResponse<T[]> = await res.json();
    return data && data?.data;
  } catch (e) {
    console.log(e);
    return undefined;
  }
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

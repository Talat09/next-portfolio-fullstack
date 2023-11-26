import ClientHomeView from "@/components/client-view/home";
import ClientAboutView from "@/components/client-view/about";
import ClientContactView from "@/components/client-view/contact";
import ClientExperienceAndEducationView from "@/components/client-view/experience";

import ClientProjectView from "@/components/client-view/project";

async function extractAllDatas(currentSection) {
  try {
    const res = await fetch(
      `https://next-portfolio-fullstack.vercel.app/api/${currentSection}/get`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const data = await res.json();
    return data && data?.data;
  } catch (e) {
    console.log(e);
  }
}

export default async function Home() {
  const homeSectionData = await extractAllDatas("home");
  const aboutSectionData = await extractAllDatas("about");
  const experienceSectionData = await extractAllDatas("experience");
  const educationSectionData = await extractAllDatas("education");
  const projectSectionData = await extractAllDatas("project");
  return (
    <div>
      <ClientHomeView data={homeSectionData} />
      <ClientAboutView
        data={
          aboutSectionData && aboutSectionData.length ? aboutSectionData[0] : []
        }
      />
      <ClientExperienceAndEducationView
        educationData={educationSectionData}
        experienceData={experienceSectionData}
      />
      <ClientProjectView data={projectSectionData} />
      <ClientContactView />
    </div>
  );
}

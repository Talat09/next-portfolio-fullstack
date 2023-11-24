import ClientAboutView from "@/components/client-view/about";
import ClientContactView from "@/components/client-view/contact";
import ClientExperienceAndEducationView from "@/components/client-view/experience";
import ClientHomeView from "@/components/client-view/home";
import ClientProjectView from "@/components/client-view/project";

export default async function Home() {
  return (
    <div>
      <ClientHomeView />
      <ClientAboutView />
      <ClientExperienceAndEducationView />
      <ClientProjectView />
      <ClientContactView />
    </div>
  );
}

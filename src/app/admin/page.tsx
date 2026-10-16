"use client";

import AdminAboutView from "@/components/admin-view/about";
import AdminContactView from "@/components/admin-view/contact";
import AdminContactInfoView from "@/components/admin-view/contact-info";
import AdminEducationView from "@/components/admin-view/education";
import AdminExperienceView from "@/components/admin-view/experience";
import AdminHomeView from "@/components/admin-view/home";
import Login from "@/components/admin-view/login";
import AdminProjectView from "@/components/admin-view/project";
import {
  addData,
  deleteData,
  getData,
  getSessionStatus,
  login,
  logout,
  reorderProjects,
  updateData,
} from "@/services";
import { useEffect, useState, type ReactNode } from "react";
import type {
  AboutData,
  Contact,
  ContactInfo,
  ContactInfoData,
  Education,
  EducationData,
  Experience,
  ExperienceData,
  HomeData,
  LoginFormData,
  Project,
  ProjectData,
  SectionTab,
} from "@/types";

interface AllData {
  home?: HomeData[];
  about?: AboutData[];
  experience?: Experience[];
  education?: Education[];
  project?: Project[];
  contact?: Contact[];
  "contact-info"?: ContactInfo[];
}

interface MenuItem {
  id: SectionTab;
  label: string;
  component: ReactNode;
}

/** A list item that can be edited / deleted (project or experience) */
type EditableItem = Partial<Project> & Partial<Experience> & Partial<Education>;
type EditableTab = "project" | "experience" | "education";

interface EditableTabConfig {
  fields: string[];
  setFormData: (data: Record<string, string>) => void;
  initialFormData: Record<string, string>;
  label: string;
  confirmText: (item: EditableItem) => string;
  itemName: (item: EditableItem) => string;
}
import toast from "react-hot-toast";

const tabLabels: Partial<Record<SectionTab, string>> = {
  home: "Home",
  about: "About",
  experience: "Experience",
  education: "Education",
  project: "Project",
  "contact-info": "Contact info",
};

const initialHomeFormData: HomeData = {
  heading: "",
  summary: "",
};
const initialAboutFormData: AboutData = {
  aboutme: "",
  noofprojects: "",
  yearofexperience: "",
  noofclients: "",
  skills: "",
  whyhirelabel: "",
  whyhireheading: "",
  whyhirehighlight: "",
};

const initialExperienceFormData: ExperienceData = {
  position: "",
  company: "",
  duration: "",
  location: "",
  jobprofile: "",
};

const initialEducationFormData: EducationData = {
  degree: "",
  year: "",
  college: "",
};

const initialProjectFormData: ProjectData = {
  name: "",
  website: "",
  technologies: "",
  github: "",
  image: "",
};
const initialContactInfoFormData: ContactInfoData = {
  label: "",
  heading: "",
  highlight: "",
  intro: "",
  email: "",
  location: "",
};
const initialLoginFormData: LoginFormData = {
  username: "",
  password: "",
};
export default function AdminView() {
  const [currentSelectedTab, setCurrentSelectedTab] = useState<SectionTab>("home");
  const [homeViewFormData, setHomeViewFormData] = useState<HomeData>(initialHomeFormData);
  const [aboutViewFormData, setAboutViewFormData] =
    useState<AboutData>(initialAboutFormData);
  const [experienceViewFormData, setExperienceViewFormData] = useState<ExperienceData>(
    initialExperienceFormData
  );
  const [educationViewFormData, setEducationViewFormData] = useState<EducationData>(
    initialEducationFormData
  );
  const [projectViewFormData, setProjectViewFormData] = useState<ProjectData>(
    initialProjectFormData
  );

  const [contactInfoViewFormData, setContactInfoViewFormData] = useState<ContactInfoData>(
    initialContactInfoFormData
  );

  const [allData, setAllData] = useState<AllData>({});

  const [update, setUpdate] = useState<boolean>(false);
  // id of the list item being edited (project / experience), null when adding
  const [editingId, setEditingId] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<boolean>(false);
  const [loginFormData, setLoginFormData] = useState<LoginFormData>(initialLoginFormData);
  async function extractAllDatas() {
    const response = await getData<unknown[]>(currentSelectedTab);
    //
    if (
      currentSelectedTab === "home" &&
      response &&
      response.data &&
      response.data.length
    ) {
      setHomeViewFormData(response && (response.data[0] as HomeData));
      setUpdate(true);
    }
    //
    if (
      currentSelectedTab === "about" &&
      response &&
      response.data &&
      response.data.length
    ) {
      setAboutViewFormData(response && (response.data[0] as AboutData));
      setUpdate(true);
    }
    //
    if (
      currentSelectedTab === "contact-info" &&
      response &&
      response.data &&
      response.data.length
    ) {
      setContactInfoViewFormData(
        response && (response.data[0] as ContactInfoData)
      );
      setUpdate(true);
    }
    //
    if (response?.success) {
      setAllData({
        ...allData,
        [currentSelectedTab]: response && response.data,
      } as AllData);
    }
  }
  async function handleSaveData() {
    const dataMap: Partial<Record<SectionTab, object>> = {
      home: homeViewFormData,
      about: aboutViewFormData,
      education: educationViewFormData,
      experience: experienceViewFormData,
      project: projectViewFormData,
      "contact-info": contactInfoViewFormData,
    };
    const isItemEdit = Boolean(
      editableTabs[currentSelectedTab as EditableTab] && editingId
    );
    const response = isItemEdit
      ? await updateData(currentSelectedTab, {
          ...(dataMap[currentSelectedTab] || {}),
          _id: editingId,
        })
      : update
      ? await updateData(currentSelectedTab, dataMap[currentSelectedTab] || {})
      : await addData(currentSelectedTab, dataMap[currentSelectedTab] || {});
    // console.log(response, "response");

    const tabLabel = tabLabels[currentSelectedTab] || "Data";
    const isUpdate = isItemEdit || update;
    if (response?.success) {
      toast.success(
        response?.message ||
          `${tabLabel} ${isUpdate ? "updated" : "added"} successfully`
      );
    } else {
      toast.error(
        response?.message ||
          `Could not ${isUpdate ? "update" : "add"} ${tabLabel.toLowerCase()}. Please try again.`
      );
    }

    if (response?.success) {
      resetFormDatas();
      setEditingId(null);
      extractAllDatas();
    }
  }

  // Tabs whose list items can be edited / deleted
  const editableTabs: Record<EditableTab, EditableTabConfig> = {
    project: {
      fields: ["name", "website", "technologies", "github", "image"],
      setFormData: (data) =>
        setProjectViewFormData(data as unknown as ProjectData),
      initialFormData: {
        name: initialProjectFormData.name,
        website: initialProjectFormData.website,
        technologies: initialProjectFormData.technologies,
        github: initialProjectFormData.github,
        image: initialProjectFormData.image ?? "",
      },
      label: "Project",
      confirmText: (item) => `Delete ${item.name}?`,
      itemName: (item) => `"${item.name}"`,
    },
    experience: {
      fields: ["position", "company", "duration", "location", "jobprofile"],
      setFormData: (data) =>
        setExperienceViewFormData(data as unknown as ExperienceData),
      initialFormData: { ...initialExperienceFormData },
      label: "Experience",
      confirmText: (item) => `Delete ${item.position} at ${item.company}?`,
      itemName: (item) => `"${item.position} at ${item.company}"`,
    },
    education: {
      fields: ["degree", "year", "college"],
      setFormData: (data) =>
        setEducationViewFormData(data as unknown as EducationData),
      initialFormData: { ...initialEducationFormData },
      label: "Education",
      confirmText: (item) => `Delete ${item.degree}?`,
      itemName: (item) => `"${item.degree}"`,
    },
  };

  function handleEditItem(tab: EditableTab, item: EditableItem) {
    const config = editableTabs[tab];
    if (!config) return;
    setEditingId(item._id ?? null);
    config.setFormData(
      config.fields.reduce<Record<string, string>>(
        (acc, field) => ({
          ...acc,
          [field]: String(item[field as keyof EditableItem] || ""),
        }),
        {}
      )
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaveProjectOrder(ids: string[]): Promise<boolean> {
    const response = await reorderProjects(ids);
    if (response?.success) {
      toast.success(response?.message || "Project order saved successfully");
      extractAllDatas();
      return true;
    }
    toast.error(
      response?.message || "Could not save project order. Please try again."
    );
    return false;
  }

  function handleCancelEdit(tab: EditableTab) {
    const config = editableTabs[tab];
    setEditingId(null);
    if (config) config.setFormData(config.initialFormData);
  }

  async function handleDeleteItem(tab: EditableTab, item: EditableItem) {
    const config = editableTabs[tab];
    if (!config) return;
    if (!window.confirm(config.confirmText(item))) return;
    if (!item._id) return;
    const response = await deleteData(tab, item._id);
    if (response?.success) {
      toast.success(
        response?.message || `${config.itemName(item)} deleted successfully`
      );
      if (editingId === item._id) handleCancelEdit(tab);
      extractAllDatas();
    } else {
      toast.error(
        response?.message ||
          `Could not delete ${config.label.toLowerCase()}. Please try again.`
      );
    }
  }

  useEffect(() => {
    // Deferred so setState runs in a callback, not synchronously in the effect body.
    void Promise.resolve().then(extractAllDatas);
    // Re-fetch only when the selected tab changes (same as before).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedTab]);

  function resetFormDatas() {
    setHomeViewFormData(initialHomeFormData);
    setAboutViewFormData(initialAboutFormData);
    setExperienceViewFormData(initialExperienceFormData);
    setEducationViewFormData(initialEducationFormData);
    setProjectViewFormData(initialProjectFormData);
    setContactInfoViewFormData(initialContactInfoFormData);
  }
  // console.log(allData, homeViewFormData, "homeview");
  useEffect(() => {
    // Ask the server whether the session cookie is valid (sessionStorage is not trusted)
    let active = true;
    getSessionStatus().then(({ authenticated, configured }) => {
      if (!active) return;
      setAuthUser(authenticated);
      if (!configured) {
        toast.error("Admin login is not configured on the server (SESSION_SECRET missing).");
      }
    });
    return () => {
      active = false;
    };
  }, []);
  async function handleLogin() {
    const res = await login(loginFormData);
    // console.log(res, "login");
    if (res?.success) {
      setAuthUser(true);
      toast.success(res?.message || "Logged in successfully");
    } else {
      toast.error(res?.message || "Login failed. Please check your credentials.");
    }
  }
  const menuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      component: (
        <AdminHomeView
          formData={homeViewFormData}
          setFormData={setHomeViewFormData}
          handleSaveData={handleSaveData}
        />
      ),
    },
    {
      id: "about",
      label: "About",
      component: (
        <AdminAboutView
          formData={aboutViewFormData}
          setFormData={setAboutViewFormData}
          handleSaveData={handleSaveData}
        />
      ),
    },
    {
      id: "experience",
      label: "Experience",
      component: (
        <AdminExperienceView
          formData={experienceViewFormData}
          setFormData={setExperienceViewFormData}
          handleSaveData={handleSaveData}
          data={allData?.experience}
          editingId={editingId}
          handleEdit={(item) => handleEditItem("experience", item)}
          handleCancelEdit={() => handleCancelEdit("experience")}
          handleDelete={(item) => handleDeleteItem("experience", item)}
        />
      ),
    },
    {
      id: "education",
      label: "Education",
      component: (
        <AdminEducationView
          formData={educationViewFormData}
          setFormData={setEducationViewFormData}
          handleSaveData={handleSaveData}
          data={allData?.education}
          editingId={editingId}
          handleEdit={(item) => handleEditItem("education", item)}
          handleCancelEdit={() => handleCancelEdit("education")}
          handleDelete={(item) => handleDeleteItem("education", item)}
        />
      ),
    },
    {
      id: "project",
      label: "Projects",
      component: (
        <AdminProjectView
          formData={projectViewFormData}
          setFormData={setProjectViewFormData}
          handleSaveData={handleSaveData}
          data={allData?.project}
          editingProjectId={editingId}
          handleEditProject={(item) => handleEditItem("project", item)}
          handleCancelEditProject={() => handleCancelEdit("project")}
          handleDeleteProject={(item) => handleDeleteItem("project", item)}
          handleSaveOrder={handleSaveProjectOrder}
        />
      ),
    },
    {
      id: "contact-info",
      label: "Contact Info",
      component: (
        <AdminContactInfoView
          formData={contactInfoViewFormData}
          setFormData={setContactInfoViewFormData}
          handleSaveData={handleSaveData}
          isUpdate={update}
        />
      ),
    },
    {
      id: "contact",
      label: "Contact",
      component: <AdminContactView data={allData && allData.contact} />,
    },
  ];
  if (!authUser)
    return (
      <Login
        formData={loginFormData}
        handleLogin={handleLogin}
        setFormData={setLoginFormData}
      />
    );

  return (
    <div className="min-h-screen bg-[#f6fbf8]">
      <header className="sticky top-0 z-30 bg-white-500/90 backdrop-blur border-b border-[#e3efe8]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-[20px] font-extrabold text-[#111827]">
            <span className="h-[36px] flex items-center px-2.5 rounded-[8px] bg-[#1a9e55] text-white-500">
              Talat
            </span>
            Mahmud
            <span className="ml-2 hidden sm:inline-flex rounded-full bg-[#e8f6ee] px-3 py-1 text-[11px] font-semibold text-[#0f7a3d]">
              ADMIN
            </span>
          </div>
          <button
            type="button"
            className="rounded-lg border-[1.5px] border-[#1a9e55] px-4 py-2 text-sm font-semibold text-[#1a9e55] hover:bg-[#e8f6ee] transition-colors"
            onClick={async () => {
              const res = await logout();
              setAuthUser(false);
              if (res?.success) toast.success("Logged out successfully");
              else toast.error(res?.message || "Logout failed. Please try again.");
            }}
          >
            Logout
          </button>
        </div>
        <nav
          className="max-w-screen-xl mx-auto px-4 sm:px-8 flex gap-1 overflow-x-auto"
          role="tablist"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={currentSelectedTab === item.id}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors after:absolute after:left-3 after:right-3 after:bottom-0 after:h-[2px] after:rounded-full ${
                currentSelectedTab === item.id
                  ? "text-[#1a9e55] after:bg-[#1a9e55]"
                  : "text-[#374151] hover:text-[#1a9e55] after:bg-transparent"
              }`}
              onClick={() => {
                setCurrentSelectedTab(item.id);
                resetFormDatas();
                setUpdate(false);
                setEditingId(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">
        {menuItems.map(
          (item) =>
            item.id === currentSelectedTab && (
              <div key={item.id}>{item.component}</div>
            )
        )}
      </main>
    </div>
  );
}

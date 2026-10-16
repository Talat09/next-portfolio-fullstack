"use client";

import AdminAboutView from "@/components/admin-view/about";
import AdminContactView from "@/components/admin-view/contact";
import AdminEducationView from "@/components/admin-view/education";
import AdminExperienceView from "@/components/admin-view/experience";
import AdminHomeView from "@/components/admin-view/home";
import Login from "@/components/admin-view/login";
import AdminProjectView from "@/components/admin-view/project";
import { addData, deleteData, getData, login, updateData } from "@/services";
import { useEffect, useState } from "react";

const initialHomeFormData = {
  heading: "",
  summary: "",
};
const initialAboutFormData = {
  aboutme: "",
  noofprojects: "",
  yearofexperience: "",
  noofclients: "",
  skills: "",
};

const initialExperienceFormData = {
  position: "",
  company: "",
  duration: "",
  location: "",
  jobprofile: "",
};

const initialEducationFormData = {
  degree: "",
  year: "",
  college: "",
};

const initialProjectFormData = {
  name: "",
  website: "",
  technologies: "",
  github: "",
};
const initialLoginFormData = {
  username: "",
  password: "",
};
export default function AdminView() {
  const [currentSelectedTab, setCurrentSelectedTab] = useState("home");
  const [homeViewFormData, setHomeViewFormData] = useState(initialHomeFormData);
  const [aboutViewFormData, setAboutViewFormData] =
    useState(initialAboutFormData);
  const [experienceViewFormData, setExperienceViewFormData] = useState(
    initialExperienceFormData
  );
  const [educationViewFormData, setEducationViewFormData] = useState(
    initialEducationFormData
  );
  const [projectViewFormData, setProjectViewFormData] = useState(
    initialProjectFormData
  );

  const [allData, setAllData] = useState({});

  const [update, setUpdate] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectMessage, setProjectMessage] = useState(null);
  const [authUser, setAuthUser] = useState(false);
  const [loginFormData, setLoginFormData] = useState(initialLoginFormData);
  const menuItems = [
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
          editingProjectId={editingProjectId}
          handleEditProject={handleEditProject}
          handleCancelEditProject={handleCancelEditProject}
          handleDeleteProject={handleDeleteProject}
          message={projectMessage}
        />
      ),
    },
    {
      id: "contact",
      label: "Contact",
      component: <AdminContactView data={allData && allData.contact} />,
    },
  ];
  async function extractAllDatas() {
    const response = await getData(currentSelectedTab);
    //
    if (
      currentSelectedTab === "home" &&
      response &&
      response.data &&
      response.data.length
    ) {
      setHomeViewFormData(response && response.data[0]);
      setUpdate(true);
    }
    //
    if (
      currentSelectedTab === "about" &&
      response &&
      response.data &&
      response.data.length
    ) {
      setAboutViewFormData(response && response.data[0]);
      setUpdate(true);
    }
    //
    if (response?.success) {
      setAllData({
        ...allData,
        [currentSelectedTab]: response && response.data,
      });
    }
  }
  async function handleSaveData() {
    const dataMap = {
      home: homeViewFormData,
      about: aboutViewFormData,
      education: educationViewFormData,
      experience: experienceViewFormData,
      project: projectViewFormData,
    };
    const isProjectEdit = currentSelectedTab === "project" && editingProjectId;
    const response = isProjectEdit
      ? await updateData("project", {
          ...projectViewFormData,
          _id: editingProjectId,
        })
      : update
      ? await updateData(currentSelectedTab, dataMap[currentSelectedTab])
      : await addData(currentSelectedTab, dataMap[currentSelectedTab]);
    // console.log(response, "response");

    if (currentSelectedTab === "project") {
      setProjectMessage(
        response?.success
          ? {
              type: "success",
              text: isProjectEdit ? "Project updated." : "Project added.",
            }
          : {
              type: "error",
              text: response?.message || "Something went wrong.",
            }
      );
    }

    if (response?.success) {
      resetFormDatas();
      setEditingProjectId(null);
      extractAllDatas();
    }
  }

  function handleEditProject(item) {
    setEditingProjectId(item._id);
    setProjectMessage(null);
    setProjectViewFormData({
      name: item.name || "",
      website: item.website || "",
      technologies: item.technologies || "",
      github: item.github || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEditProject() {
    setEditingProjectId(null);
    setProjectViewFormData(initialProjectFormData);
  }

  async function handleDeleteProject(item) {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    const response = await deleteData("project", item._id);
    setProjectMessage(
      response?.success
        ? { type: "success", text: `"${item.name}" deleted.` }
        : { type: "error", text: response?.message || "Delete failed." }
    );
    if (response?.success) {
      if (editingProjectId === item._id) handleCancelEditProject();
      extractAllDatas();
    }
  }

  useEffect(() => {
    extractAllDatas();
  }, [currentSelectedTab]);

  function resetFormDatas() {
    setHomeViewFormData(initialHomeFormData);
    setAboutViewFormData(initialAboutFormData);
    setExperienceViewFormData(initialExperienceFormData);
    setEducationViewFormData(initialEducationFormData);
    setProjectViewFormData(initialProjectFormData);
  }
  // console.log(allData, homeViewFormData, "homeview");
  useEffect(() => {
    const getuser = JSON.parse(sessionStorage.getItem("authUser"));
    setAuthUser(getuser);
  }, []);
  async function handleLogin() {
    const res = await login(loginFormData);
    // console.log(res, "login");
    if (res?.success) {
      setAuthUser(true);
      sessionStorage.setItem("authUser", JSON.stringify(true));
    }
  }
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
            onClick={() => {
              setAuthUser(false);
              sessionStorage.removeItem("authUser");
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
                setEditingProjectId(null);
                setProjectMessage(null);
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

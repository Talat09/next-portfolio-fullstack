"use client";

import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls = [
  {
    name: "aboutme",
    placeholder: "About Me",
    type: "textarea",
    label: "About Me",
  },
  {
    name: "noofprojects",
    placeholder: "No of projects",
    type: "text",
    label: "Enter no of projects",
  },
  {
    name: "yearofexperience",
    placeholder: "No of experience",
    type: "text",
    label: "Enter no of experience",
  },
  {
    name: "noofclients",
    placeholder: "No of clients",
    type: "text",
    label: "Enter no of clients",
  },
  {
    name: "skills",
    placeholder: "skills",
    type: "text",
    label: "Skills",
  },
];
export default function AdminAboutView({
  formData,
  setFormData,
  handleSaveData,
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="WHY HIRE ME" title="About Section" description="Stats, about text and comma-separated skills.">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("about")}
            className={primaryButtonClass}
          >
            Add Info
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

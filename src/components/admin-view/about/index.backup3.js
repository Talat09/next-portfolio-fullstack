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
  {
    name: "whyhirelabel",
    placeholder: "WHY HIRE ME",
    type: "text",
    label: "Why Hire Me - pill label (optional)",
  },
  {
    name: "whyhirehighlight",
    placeholder: "Project",
    type: "text",
    label: "Why Hire Me - green highlighted word (optional)",
  },
  {
    name: "whyhireheading",
    placeholder: "Why Hire Me For Your Next Project ?",
    type: "textarea",
    label: "Why Hire Me - heading (optional)",
  },
];
export default function AdminAboutView({
  formData,
  setFormData,
  handleSaveData,
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="WHY HIRE ME" title="About Section" description="Stats, about text (shown as the Why Hire Me description) and comma-separated skills. Leave the Why Hire Me fields empty to use the defaults.">
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

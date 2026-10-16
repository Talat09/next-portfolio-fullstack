"use client";

import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls = [
  {
    name: "heading",
    placeholder: "Enter heading text",
    type: "text",
    label: "Enter heading text",
  },
  {
    name: "summary",
    placeholder: "Enter career summary",
    type: "textarea",
    label: "Enter career summary",
  },
];
export default function AdminHomeView({
  formData,
  setFormData,
  handleSaveData,
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="HERO" title="Home Section" description="Main heading and career summary shown at the top of the site.">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("home")}
            className={primaryButtonClass}
          >
            Add Info
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

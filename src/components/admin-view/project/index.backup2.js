"use client";

import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls = [
  {
    name: "name",
    placeholder: "Project Name",
    type: "text",
    label: "Project Name",
  },
  {
    name: "technologies",
    placeholder: "Enter Technologies",
    type: "text",
    label: "Enter Technologies",
  },
  {
    name: "website",
    placeholder: "Website",
    type: "text",
    label: "Website",
  },
  {
    name: "github",
    placeholder: "Github",
    type: "text",
    label: "github",
  },
];
export default function AdminProjectView({
  formData,
  setFormData,
  handleSaveData,
  data,
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="MY WORK" title="Projects" description="Add a project. Technologies are comma-separated.">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("project")}
            className={primaryButtonClass}
          >
            Add Info
          </button>
        </div>
      </AdminCard>
      <AdminCard pill="SAVED" title="Existing entries">
        {data && data.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item, i) => (
              <li
                key={item._id || i}
                className="rounded-xl border border-[#e3efe8] bg-[#f8fcfa] p-4 text-sm"
              >
                <p className="font-bold text-[#111827] break-words">{item.name}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">technologies:</span> {item.technologies}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">website:</span> {item.website}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">github:</span> {item.github}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#6b7280]">No entries yet.</p>
        )}
      </AdminCard>
    </div>
  );
}

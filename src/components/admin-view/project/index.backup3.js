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
  editingProjectId,
  handleEditProject,
  handleCancelEditProject,
  handleDeleteProject,
  message,
}) {
  const isEditing = Boolean(editingProjectId);
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard
        pill={isEditing ? "EDITING" : "MY WORK"}
        title={isEditing ? "Edit Project" : "Projects"}
        description={
          isEditing
            ? "Change the fields and click Update Project."
            : "Add a project. Technologies are comma-separated."
        }
      >
        {message ? (
          <p
            role="status"
            className={`mb-5 rounded-lg px-4 py-2.5 text-sm font-medium ${
              message.type === "success"
                ? "bg-[#e8f6ee] text-[#0f7a3d]"
                : "bg-[#fdecec] text-[#b42318]"
            }`}
          >
            {message.text}
          </p>
        ) : null}
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <button
              type="button"
              onClick={handleCancelEditProject}
              className="rounded-lg border-[1.5px] border-[#d1d5db] px-6 py-3 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleSaveData("project")}
            className={primaryButtonClass}
          >
            {isEditing ? "Update Project" : "Add Info"}
          </button>
        </div>
      </AdminCard>
      <AdminCard pill="SAVED" title="Existing entries">
        {data && data.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item, i) => (
              <li
                key={item._id || i}
                className={`flex flex-col rounded-xl border p-4 text-sm ${
                  editingProjectId === item._id
                    ? "border-[#1a9e55] bg-[#e8f6ee]"
                    : "border-[#e3efe8] bg-[#f8fcfa]"
                }`}
              >
                <p className="font-bold text-[#111827] break-words">{item.name}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">technologies:</span> {item.technologies}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">website:</span> {item.website}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">github:</span> {item.github}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditProject(item)}
                    className="rounded-lg border-[1.5px] border-[#1a9e55] px-4 py-1.5 text-xs font-semibold text-[#1a9e55] hover:bg-[#e8f6ee] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(item)}
                    className="rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] px-4 py-1.5 text-xs font-semibold text-white-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
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

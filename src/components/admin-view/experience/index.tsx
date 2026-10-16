"use client";

import type { Experience, ExperienceData, FormControl } from "@/types";
import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls: FormControl[] = [
  {
    name: "position",
    placeholder: "e.g. Mid-Level Full Stack Developer",
    type: "text",
    label: "Position",
  },
  {
    name: "company",
    placeholder: "e.g. Okriya",
    type: "text",
    label: "Company",
  },
  {
    name: "duration",
    placeholder: "e.g. July 2025 - Present",
    type: "text",
    label: "Duration",
    helperText: "Format: Month YYYY - Month YYYY, or Month YYYY - Present.",
  },
  {
    name: "location",
    placeholder: "e.g. Dhaka, Bangladesh",
    type: "text",
    label: "Location",
    helperText: "Shown after the company: \"Okriya, Dhaka, Bangladesh\".",
  },
  {
    name: "jobprofile",
    placeholder: "Select job type",
    type: "select",
    options: ["Fulltime", "Internship"],
    label: "Job Profile",
    helperText: "Shown verbatim as the green tag on the card.",
  },
];
export default function AdminExperienceView({
  formData,
  setFormData,
  handleSaveData,
  data,
  editingId,
  handleEdit,
  handleCancelEdit,
  handleDelete,
}: {
  formData: ExperienceData;
  setFormData: (data: ExperienceData) => void;
  handleSaveData: (tab?: string) => void;
  data?: Experience[];
  editingId: string | null;
  handleEdit: (item: Experience) => void;
  handleCancelEdit: () => void;
  handleDelete: (item: Experience) => void;
}) {
  const isEditing = Boolean(
    editingId && data && data.some((item) => item._id === editingId)
  );
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard
        pill={isEditing ? "EDITING" : "MY JOURNEY"}
        title={isEditing ? "Edit Experience" : "Experience"}
        description={
          isEditing
            ? "Change the fields and click Update Experience."
            : "Add a job. Job Profile is shown as the tag (e.g. Internship / Fulltime)."
        }
      >
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end gap-3">
          {isEditing ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border-[1.5px] border-[#d1d5db] px-6 py-3 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleSaveData("experience")}
            className={primaryButtonClass}
          >
            {isEditing ? "Update Experience" : "Add Info"}
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
                  editingId === item._id
                    ? "border-[#1a9e55] bg-[#e8f6ee]"
                    : "border-[#e3efe8] bg-[#f8fcfa]"
                }`}
              >
                <p className="font-bold text-[#111827] break-words">{item.position}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">company:</span> {item.company}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">duration:</span> {item.duration}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">location:</span> {item.location}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">jobprofile:</span> {item.jobprofile}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg border-[1.5px] border-[#1a9e55] px-4 py-1.5 text-xs font-semibold text-[#1a9e55] hover:bg-[#e8f6ee] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
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

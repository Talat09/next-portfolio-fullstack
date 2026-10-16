"use client";

import type { Education, EducationData, FormControl } from "@/types";
import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls: FormControl[] = [
  {
    name: "degree",
    placeholder: "e.g. Bsc in Computer Science & Engineering",
    type: "text",
    label: "Enter Degree Name",
  },
  {
    name: "year",
    placeholder: "e.g. 2018 - 2022",
    type: "text",
    label: "Year",
    helperText: "Format: YYYY - YYYY.",
  },
  {
    name: "college",
    placeholder: "e.g. East Delta University",
    type: "text",
    label: "Enter College Name",
  },
];
export default function AdminEducationView({
  formData,
  setFormData,
  handleSaveData,
  data,
  editingId,
  handleEdit,
  handleCancelEdit,
  handleDelete,
}: {
  formData: EducationData;
  setFormData: (data: EducationData) => void;
  handleSaveData: (tab?: string) => void;
  data?: Education[];
  editingId: string | null;
  handleEdit: (item: Education) => void;
  handleCancelEdit: () => void;
  handleDelete: (item: Education) => void;
}) {
  const isEditing = Boolean(
    editingId && data && data.some((item) => item._id === editingId)
  );
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard
        pill={isEditing ? "EDITING" : "MY ACADEMIC BACKGROUND"}
        title={isEditing ? "Edit Education" : "Education"}
        description={
          isEditing ? "Change the fields and click Update Education." : "Add a degree."
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
            onClick={() => handleSaveData("education")}
            className={primaryButtonClass}
          >
            {isEditing ? "Update Education" : "Add Info"}
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
                <p className="font-bold text-[#111827] break-words">{item.degree}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">college:</span> {item.college}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">year:</span> {item.year}</p>
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

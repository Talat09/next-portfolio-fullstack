"use client";

import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls = [
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
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="MY ACADEMIC BACKGROUND" title="Education" description="Add a degree.">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("education")}
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
                <p className="font-bold text-[#111827] break-words">{item.degree}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">college:</span> {item.college}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">year:</span> {item.year}</p>
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

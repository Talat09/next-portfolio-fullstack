"use client";

import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls = [
  {
    name: "position",
    placeholder: "Position",
    type: "text",
    label: "Position",
  },
  {
    name: "company",
    placeholder: "Company",
    type: "text",
    label: "Company",
  },
  {
    name: "duration",
    placeholder: "Duration",
    type: "text",
    label: "Duration",
  },
  {
    name: "location",
    placeholder: "Location",
    type: "text",
    label: "Location",
  },
  {
    name: "jobprofile",
    placeholder: "Job Profile",
    type: "text",
    label: "Job Profile",
  },
];
export default function AdminExperienceView({
  formData,
  setFormData,
  handleSaveData,
  data,
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="MY JOURNEY" title="Experience" description="Add a job. Job Profile is shown as the tag (e.g. Internship / Fulltime).">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("experience")}
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
                <p className="font-bold text-[#111827] break-words">{item.position}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">company:</span> {item.company}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">duration:</span> {item.duration}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">location:</span> {item.location}</p>
                <p className="mt-1 text-[#4b5563] break-words"><span className="font-semibold text-[#111827]">jobprofile:</span> {item.jobprofile}</p>
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

"use client";

import FormControls from "../form-controls";

const controls = [
  {
    name: "yearsofexperience",
    placeholder: "No of experience",
    type: "text",
    label: "Enter no of experience",
  },
  {
    name: "noofclient",
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
export default function AdminAboutView({ formData, setFormData }) {
  return (
    <div className="w-full">
      <div className="bg-[#ffffff] shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <button className="mt-[10px] border border-green-600 p-4 font-bold text-[16px] rounded-md">
          Add Info
        </button>
      </div>
    </div>
  );
}

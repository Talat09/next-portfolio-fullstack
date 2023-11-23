"use client";

import FormControls from "../form-controls";
const controls = [
  {
    name: "username",
    placeholder: "Enter User Name",
    type: "text",
    label: "Enter User Name",
  },
  {
    name: "password",
    placeholder: "Enter Password",
    type: "password",
    label: "Enter Password",
  },
];
export default function Login({ formData, setFormData }) {
  return (
    <div className="w-full">
      <div className="bg-[#ffffff] shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <button
          onClick={() => handleSaveData("home")}
          className="mt-[10px] border border-green-600 p-4 font-bold text-[16px] rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
}

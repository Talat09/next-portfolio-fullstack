"use client";

import FormControls, { primaryButtonClass } from "../form-controls";

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

export default function Login({ formData, setFormData, handleLogin }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#f6fbf8] overflow-hidden">
      <div aria-hidden="true" className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#e6f6ec]" />
      <div aria-hidden="true" className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-[#e6f6ec]" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="relative w-full max-w-md rounded-2xl bg-white-500 p-8 shadow-[0_20px_50px_-20px_rgba(15,122,61,0.3)] border border-[#eef3f0]"
      >
        <div className="flex items-center gap-1.5 text-[22px] font-extrabold text-[#111827]">
          <span className="h-[40px] flex items-center px-2.5 rounded-[8px] bg-[#1a9e55] text-white-500">
            Talat
          </span>
          Mahmud
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-[#111827]">
          Admin <span className="text-[#1a9e55]">Login</span>
        </h1>
        <p className="mt-1 mb-6 text-sm text-[#6b7280]">
          Sign in to manage your portfolio content.
        </p>
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
          singleColumn
        />
        <button type="submit" className={`${primaryButtonClass} w-full mt-6`}>
          Login
        </button>
      </form>
    </div>
  );
}

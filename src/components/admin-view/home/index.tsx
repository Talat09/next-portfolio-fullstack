"use client";

import type { FormControl, HomeData } from "@/types";
import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls: FormControl[] = [
  {
    name: "heading",
    placeholder: "e.g. I have Creative Development Experience.",
    type: "text",
    label: "Enter heading text",
    helperText:
      "Words 3 and 4 are shown in green (e.g. \"Creative Development\"). On large screens the heading breaks after word 3 and after word 4.",
  },
  {
    name: "summary",
    placeholder:
      "e.g. Hi, I'm Talat Mahmud, a skilled Full Stack Web Developer specializing in React.js, JavaScript, HTML, and CSS...",
    type: "textarea",
    label: "Enter career summary",
    helperText: "Plain text paragraph shown under the heading in the hero.",
  },
];
interface AdminHomeViewProps {
  formData: HomeData;
  setFormData: (data: HomeData) => void;
  handleSaveData: (tab?: string) => void;
}

export default function AdminHomeView({
  formData,
  setFormData,
  handleSaveData,
}: AdminHomeViewProps) {
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

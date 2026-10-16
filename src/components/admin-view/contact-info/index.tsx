"use client";

import type { ContactInfoData, FormControl } from "@/types";
import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls: FormControl[] = [
  {
    name: "label",
    placeholder: "GET IN TOUCH",
    type: "text",
    label: "Pill label (optional)",
    helperText: "Short uppercase label, e.g. GET IN TOUCH.",
  },
  {
    name: "highlight",
    placeholder: "Me",
    type: "text",
    label: "Green highlighted word (optional)",
    helperText:
      "Must exactly match part of the heading (case-sensitive); the first match turns green. With a custom heading, empty = no highlight.",
  },
  {
    name: "heading",
    placeholder: "Contact Me",
    type: "text",
    label: "Heading (optional)",
  },
  {
    name: "email",
    placeholder: "talatmahmud@example.com",
    type: "email",
    label: "Email (optional)",
    helperText: "e.g. name@gmail.com - shown as a mailto: link.",
  },
  {
    name: "location",
    placeholder: "Dhaka, Bangladesh",
    type: "text",
    label: "Location (optional)",
    helperText: "Format: City, Country.",
  },
  {
    name: "intro",
    placeholder:
      "Have a project in mind or want to work together? Feel free to send me a message. I'll get back to you as soon as possible.",
    type: "textarea",
    label: "Intro text (optional)",
  },
];

export default function AdminContactInfoView({
  formData,
  setFormData,
  handleSaveData,
  isUpdate,
}: {
  formData: ContactInfoData;
  setFormData: (data: ContactInfoData) => void;
  handleSaveData: (tab?: string) => void;
  isUpdate: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard
        pill="GET IN TOUCH"
        title="Contact Section Content"
        description="Text shown in the public Contact section. Empty fields use the defaults shown as placeholders."
      >
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("contact-info")}
            className={primaryButtonClass}
          >
            {isUpdate ? "Update Info" : "Add Info"}
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

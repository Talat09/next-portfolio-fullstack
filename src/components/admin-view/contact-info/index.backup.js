"use client";

import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls = [
  {
    name: "label",
    placeholder: "GET IN TOUCH",
    type: "text",
    label: "Pill label (optional)",
  },
  {
    name: "highlight",
    placeholder: "Me",
    type: "text",
    label: "Green highlighted word (optional)",
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
  },
  {
    name: "location",
    placeholder: "Dhaka, Bangladesh",
    type: "text",
    label: "Location (optional)",
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

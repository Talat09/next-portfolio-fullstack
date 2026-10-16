"use client";

import type { FormControl, AboutData } from "@/types";
import FormControls, { AdminCard, primaryButtonClass } from "../form-controls";

const controls: FormControl[] = [
  {
    name: "aboutme",
    placeholder:
      "e.g. Delivering impactful websites, I offer strong problem-solving and collaboration skills, ready to bring your project vision to reality.",
    type: "textarea",
    label: "About Me",
    helperText: "Shown as the Why Hire Me description.",
  },
  {
    name: "noofprojects",
    placeholder: "e.g. 20",
    type: "number",
    min: 0,
    label: "Enter no of projects",
    helperText: "Number only - the \"+\" is added automatically (20 → 20+).",
  },
  {
    name: "yearofexperience",
    placeholder: "e.g. 3",
    type: "number",
    min: 0,
    label: "Enter no of experience",
    helperText:
      "Years, number only - \"+\" is added automatically. Also used in the hero \"3+ Years\" badge.",
  },
  {
    name: "noofclients",
    placeholder: "e.g. 10",
    type: "number",
    min: 0,
    label: "Enter no of clients",
    helperText: "Number only - the \"+\" is added automatically (10 → 10+).",
  },
  {
    name: "skills",
    placeholder: "e.g. React JS, Next JS, Redux, Tailwind CSS",
    type: "textarea",
    label: "Skills",
    helperText:
      "Comma-separated. Names with a brand icon: React JS, Next JS, Redux, CSS, Bootstrap, Tailwind CSS, Material UI, Daisy UI, Express JS, MongoDB, MySQL, JavaScript, HTML, Node JS, Firebase, TypeScript (spaces/dots/case don't matter). Others get a generic code icon.",
  },
  {
    name: "whyhirelabel",
    placeholder: "WHY HIRE ME",
    type: "text",
    label: "Why Hire Me - pill label (optional)",
    helperText: "Leave empty to use \"WHY HIRE ME\".",
  },
  {
    name: "whyhirehighlight",
    placeholder: "Project",
    type: "text",
    label: "Why Hire Me - green highlighted word (optional)",
    helperText:
      "Must exactly match part of the heading (case-sensitive); the first match turns green. Empty + default heading → \"Project\".",
  },
  {
    name: "whyhireheading",
    placeholder: "Why Hire Me For Your Next Project ?",
    type: "textarea",
    label: "Why Hire Me - heading (optional)",
    helperText: "Leave empty to use the default heading.",
  },
];
interface AdminAboutViewProps {
  formData: AboutData;
  setFormData: (data: AboutData) => void;
  handleSaveData: (tab?: string) => void;
}

export default function AdminAboutView({
  formData,
  setFormData,
  handleSaveData,
}: AdminAboutViewProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <AdminCard pill="WHY HIRE ME" title="About Section" description="Stats, about text (shown as the Why Hire Me description) and comma-separated skills. Leave the Why Hire Me fields empty to use the defaults.">
        <FormControls
          controls={controls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleSaveData("about")}
            className={primaryButtonClass}
          >
            Add Info
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

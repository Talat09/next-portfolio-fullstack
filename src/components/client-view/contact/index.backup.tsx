"use client";
import { useEffect, useState } from "react";
import { m, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { ContactData, ContactInfo, FormControl } from "@/types";
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { Blob, DotGrid, SectionDecor, Squiggle } from "../decor";
import AnimationWrapper from "../animation-wrapper";
import { addData } from "@/services";
import { siteConfig } from "@/lib/site-config";

// Defaults used when the Contact Info document (admin > Contact Info) is empty
const DEFAULT_LABEL = "GET IN TOUCH";
const DEFAULT_HEADING = "Contact Me";
const DEFAULT_HIGHLIGHT = "Me";
const DEFAULT_INTRO =
  "Have a project in mind or want to work together? Feel free to send me a message. I'll get back to you as soon as possible.";
// Email/location fallbacks come from NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_LOCATION
const DEFAULT_EMAIL = siteConfig.contactEmail;
const DEFAULT_LOCATION = siteConfig.contactLocation;

// The toast library is fetched only when the first message is shown.
const AppToaster = dynamic(() => import("../toaster"), { ssr: false });

// Wraps the first (case-sensitive) occurrence of highlight in a green span
function renderHighlighted(text: string, highlight: string): ReactNode {
  const index = highlight ? text.indexOf(highlight) : -1;
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-green-brand">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

const controls: FormControl[] = [
  { name: "name", placeholder: "Your name", type: "text", label: "Name" },
  { name: "email", placeholder: "your@email.com", type: "email", label: "Email" },
  {
    name: "message",
    placeholder: "Write your message here...",
    type: "text",
    label: "Message",
  },
];

const initialFormData: ContactData = {
  name: "",
  email: "",
  message: "",
};

const fadeUp: Variants = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

const inputClass =
  "w-full border border-gray-500 focus:border-green-main bg-white-500 rounded-lg text-sm text-black-600 min-h-11 py-2.5 px-3 leading-6 transition-colors";

export default function ClientContactView({
  data,
}: {
  data?: ContactInfo | null;
}) {
  const pick = (value: string | undefined, fallback: string): string =>
    typeof value === "string" && value.trim() ? value.trim() : fallback;
  const label = pick(data?.label, DEFAULT_LABEL);
  const heading = pick(data?.heading, DEFAULT_HEADING);
  const highlight = pick(
    data?.highlight,
    pick(data?.heading, "") ? "" : DEFAULT_HIGHLIGHT
  );
  const intro = pick(data?.intro, DEFAULT_INTRO);
  const contactEmail = pick(data?.email, DEFAULT_EMAIL);
  const contactLocation = pick(data?.location, DEFAULT_LOCATION);
  const [formData, setFormData] = useState<ContactData>(initialFormData);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [toasterMounted, setToasterMounted] = useState(false);

  async function notify(kind: "success" | "error", message: string) {
    setToasterMounted(true);
    const { default: toast } = await import("react-hot-toast");
    toast[kind](message);
  }
  // honeypot: hidden from people, bots tend to fill it
  const [company, setCompany] = useState("");

  async function handleSendMessage() {
    setSending(true);
    const res = await addData("contact", { ...formData, company });
    setSending(false);

    if (res && res.success) {
      setFormData(initialFormData);
      setShowSuccessMessage(true);
      notify("success", res?.message || "Message sent successfully");
    } else {
      notify("error", res?.message || "Could not send your message. Please try again.");
    }
  }

  useEffect(() => {
    if (showSuccessMessage) {
      const t = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [showSuccessMessage]);

  const isValidForm = () => {
    return formData &&
      formData.name !== "" &&
      formData.email !== "" &&
      formData.message !== ""
      ? true
      : false;
  };

  function handleChange(name: string, value: string) {
    setFormData({ ...formData, [name]: value });
  }

  return (
    <section
      className="relative isolate max-w-screen-xl py-16 lg:py-24 px-6 sm:px-8 lg:px-16 mx-auto"
      id="contact"
    >
      <SectionDecor>
        <Blob className="-left-24 top-6 w-64 h-64 bg-[#e6f6ec]/70" />
        <Blob className="-right-20 bottom-4 w-52 h-52 bg-[#eef9f2] hidden sm:block" />
        <DotGrid className="right-[4%] top-8 hidden md:grid" />
        <Squiggle className="left-[6%] bottom-8 w-24 hidden md:block" />
      </SectionDecor>
      <AnimationWrapper>
        <m.div
          variants={fadeUp}
          className="relative rounded-2xl bg-[#effbf4] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white-500 px-4 py-1.5 text-xs font-semibold text-black-600">
              <span className="w-2 h-2 rounded-full bg-green-main" />
              {label}
            </span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-black-600">
              {renderHighlighted(heading, highlight)}
            </h2>
            <p className="text-black-500 leading-7 mt-4 max-w-md">
              {intro}
            </p>
            <ul className="mt-6 flex flex-wrap gap-6">
              {contactEmail ? (
              <li className="flex items-center gap-3 text-sm text-black-600">
                <span className="w-9 h-9 rounded-full bg-green-main text-white-500 flex items-center justify-center">
                  <FaEnvelope aria-hidden="true" />
                </span>
                <a href={`mailto:${contactEmail}`} className="inline-flex min-h-11 items-center break-all hover:text-green-main">
                  {contactEmail}
                </a>
              </li>
              ) : null}
              {contactLocation ? (
              <li className="flex items-center gap-3 text-sm text-black-600">
                <span className="w-9 h-9 rounded-full bg-green-main text-white-500 flex items-center justify-center">
                  <FaMapMarkerAlt aria-hidden="true" />
                </span>
                {contactLocation}
              </li>
              ) : null}
            </ul>
            <FaPaperPlane
              aria-hidden="true"
              className="hidden lg:block absolute right-8 top-6 w-14 h-14 text-green-brand -rotate-12 opacity-90"
            />
          </div>

          <form
            className="bg-white-500 rounded-2xl shadow-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValidForm()) handleSendMessage();
              else notify("error", "Please fill in your name, email and message.");
            }}
          >
            <div aria-hidden="true" className="hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            {controls.map((controlItem) =>
              controlItem.name === "message" ? (
                <div className="sm:col-span-2" key={controlItem.name}>
                  <label
                    htmlFor={controlItem.name}
                    className="block text-sm font-medium text-black-600 mb-1"
                  >
                    {controlItem.label}
                  </label>
                  <textarea
                    id={controlItem.name}
                    name={controlItem.name}
                    placeholder={controlItem.placeholder}
                    value={formData[controlItem.name as keyof ContactData]}
                    onChange={(e) => handleChange(controlItem.name, e.target.value)}
                    className={`${inputClass} h-32 resize-none`}
                  ></textarea>
                </div>
              ) : (
                <div key={controlItem.name}>
                  <label
                    htmlFor={controlItem.name}
                    className="block text-sm font-medium text-black-600 mb-1"
                  >
                    {controlItem.label}
                  </label>
                  <input
                    id={controlItem.name}
                    name={controlItem.name}
                    type={controlItem.type}
                    placeholder={controlItem.placeholder}
                    value={formData[controlItem.name as keyof ContactData]}
                    onChange={(e) => handleChange(controlItem.name, e.target.value)}
                    className={inputClass}
                  />
                </div>
              )
            )}
            {showSuccessMessage && (
              <p className="sm:col-span-2 text-sm font-bold text-green-main" role="status">
                Your message is successfully delivered !
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="sm:col-span-2 btn-primary w-full"
            >
              <FaPaperPlane aria-hidden="true" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </m.div>
      </AnimationWrapper>
      {toasterMounted ? <AppToaster /> : null}
    </section>
  );
}

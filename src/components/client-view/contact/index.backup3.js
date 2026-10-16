"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import AnimationWrapper from "../animation-wrapper";
import { addData } from "@/services";
import toast from "react-hot-toast";

// TODO: replace with your real email
const CONTACT_EMAIL = "talatmahmud@example.com";
const CONTACT_LOCATION = "Dhaka, Bangladesh";

const controls = [
  { name: "name", placeholder: "Your name", type: "text", label: "Name" },
  { name: "email", placeholder: "your@email.com", type: "email", label: "Email" },
  {
    name: "message",
    placeholder: "Write your message here...",
    type: "text",
    label: "Message",
  },
];

const initialFormData = {
  name: "",
  email: "",
  message: "",
};

const fadeUp = {
  offscreen: { y: 40, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", duration: 1 } },
};

const inputClass =
  "w-full border border-gray-500 focus:border-green-main bg-white-500 rounded-lg text-sm outline-none text-black-600 py-2.5 px-3 leading-6 transition-colors";

export default function ClientContactView() {
  const [formData, setFormData] = useState(initialFormData);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  async function handleSendMessage() {
    const res = await addData("contact", formData);

    if (res && res.success) {
      setFormData(initialFormData);
      setShowSuccessMessage(true);
      toast.success(res?.message || "Message sent successfully");
    } else {
      toast.error(res?.message || "Could not send your message. Please try again.");
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

  function handleChange(name, value) {
    setFormData({ ...formData, [name]: value });
  }

  return (
    <section
      className="max-w-screen-xl mt-16 mb-24 lg:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="contact"
    >
      <AnimationWrapper>
        <motion.div
          variants={fadeUp}
          className="relative rounded-3xl bg-[#effbf4] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white-500 px-4 py-1.5 text-xs font-semibold text-black-600">
              <span className="w-2 h-2 rounded-full bg-green-main" />
              GET IN TOUCH
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-black-600">
              Contact <span className="text-green-main">Me</span>
            </h2>
            <p className="text-black-500 mt-4 max-w-md">
              Have a project in mind or want to work together? Feel free to
              send me a message. I&apos;ll get back to you as soon as possible.
            </p>
            <ul className="mt-6 flex flex-wrap gap-6">
              <li className="flex items-center gap-3 text-sm text-black-600">
                <span className="w-9 h-9 rounded-full bg-green-main text-white-500 flex items-center justify-center">
                  <FaEnvelope aria-hidden="true" />
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-green-main">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-black-600">
                <span className="w-9 h-9 rounded-full bg-green-main text-white-500 flex items-center justify-center">
                  <FaMapMarkerAlt aria-hidden="true" />
                </span>
                {CONTACT_LOCATION}
              </li>
            </ul>
            <FaPaperPlane
              aria-hidden="true"
              className="hidden lg:block absolute right-8 top-6 w-14 h-14 text-green-main -rotate-12 opacity-90"
            />
          </div>

          <form
            className="bg-white-500 rounded-2xl shadow-md p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValidForm()) handleSendMessage();
            }}
          >
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
                    value={formData[controlItem.name]}
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
                    value={formData[controlItem.name]}
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
              disabled={!isValidForm()}
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 disabled:opacity-50 py-3 text-white-500 font-semibold rounded-lg text-sm bg-green-main outline-none hover:opacity-90 transition-all"
            >
              <FaPaperPlane aria-hidden="true" />
              Send Message
            </button>
          </form>
        </motion.div>
      </AnimationWrapper>
    </section>
  );
}

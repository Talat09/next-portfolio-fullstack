"use client";

export const inputClass =
  "w-full rounded-lg border border-[#dfe7e2] bg-white-500 py-2.5 px-3 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:border-[#1a9e55] focus:ring-2 focus:ring-[#1a9e55]/20";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a9e55] hover:bg-[#0f7a3d] px-6 py-3 text-sm font-semibold text-white-500 shadow-[0_12px_24px_-12px_rgba(26,158,85,0.8)] transition-colors disabled:opacity-50";

export function AdminPill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f6ee] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#111827]">
      <span className="h-2 w-2 rounded-full bg-[#1a9e55]" />
      {children}
    </span>
  );
}

export function AdminCard({ pill, title, description, children }) {
  return (
    <section className="rounded-2xl bg-white-500 p-6 sm:p-8 shadow-[0_10px_30px_-12px_rgba(15,122,61,0.18)] border border-[#eef3f0]">
      {pill ? <AdminPill>{pill}</AdminPill> : null}
      {title ? (
        <h2 className="mt-3 text-2xl font-extrabold text-[#111827]">{title}</h2>
      ) : null}
      {description ? (
        <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
      ) : null}
      <div className={title || pill ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

// type "textarea" renders a multi-line field that spans both columns
export default function FormControls({
  controls,
  formData,
  setFormData,
  singleColumn = false,
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-5 ${singleColumn ? "" : "md:grid-cols-2"}`}
    >
      {controls.map((controlItem) => (
        <div
          key={controlItem.name}
          className={controlItem.type === "textarea" ? "md:col-span-2" : ""}
        >
          <label
            htmlFor={controlItem.name}
            className="block text-sm font-semibold text-[#111827] mb-1.5"
          >
            {controlItem.label}
          </label>
          {controlItem.type === "textarea" ? (
            <textarea
              placeholder={controlItem.placeholder}
              name={controlItem.name}
              id={controlItem.name}
              rows={5}
              value={formData[controlItem.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [controlItem.name]: e.target.value })
              }
              className={`${inputClass} resize-y leading-6`}
            />
          ) : (
            <input
              placeholder={controlItem.placeholder}
              type={controlItem.type}
              name={controlItem.name}
              id={controlItem.name}
              value={formData[controlItem.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [controlItem.name]: e.target.value })
              }
              className={inputClass}
            />
          )}
        </div>
      ))}
    </div>
  );
}

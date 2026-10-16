"use client";

import type { Contact } from "@/types";

import { AdminCard } from "../form-controls";

export default function AdminContactView({ data }: { data?: Contact[] }) {
  return (
    <AdminCard
      pill="GET IN TOUCH"
      title="Contact Messages"
      description="Messages sent from the contact form."
    >
      {data && data?.length ? (
        <ul className="flex flex-col gap-4">
          {data.map((item, i) => (
            <li
              key={item._id || i}
              className="rounded-xl border border-[#e3efe8] bg-[#f8fcfa] p-4 text-sm"
            >
              <p className="font-bold text-[#111827]">Name: {item.name}</p>
              <p className="mt-1 text-[#4b5563]">
                Email:{" "}
                <a href={`mailto:${item.email}`} className="text-[#1a9e55] hover:underline">
                  {item.email}
                </a>
              </p>
              <p className="mt-2 text-[#374151] whitespace-pre-line break-words">
                Message: {item.message}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#6b7280]">No messages yet.</p>
      )}
    </AdminCard>
  );
}

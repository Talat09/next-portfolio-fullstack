"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "../navbar";
import { Toaster } from "react-hot-toast";

export default function CommonLayout({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  return (
    <>
      {pathName !== "/admin" ? <Navbar /> : null}
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#111827",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 12px 30px -10px rgba(15, 122, 61, 0.35)",
          },
          success: {
            style: { border: "1px solid #1a9e55" },
            iconTheme: { primary: "#1a9e55", secondary: "#ffffff" },
          },
          error: {
            style: { border: "1px solid #dc2626" },
            iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
          },
        }}
      />
    </>
  );
}

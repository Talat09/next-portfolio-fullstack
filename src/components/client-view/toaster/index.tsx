"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "react-hot-toast";

/** Site-styled toast container. Mount it only where toasts are shown. */
export default function AppToaster() {
  // Render into <body> so a transformed or overflow-hidden section can never hide the toasts.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <Toaster
      containerStyle={{ zIndex: 99999 }}
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
    />,
    document.body
  );
}

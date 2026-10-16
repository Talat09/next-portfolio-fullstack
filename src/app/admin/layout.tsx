import type { ReactNode } from "react";
import AppToaster from "@/components/client-view/toaster";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <AppToaster />
    </>
  );
}

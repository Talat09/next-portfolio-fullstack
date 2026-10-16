// Admin only: requires a valid session (see src/lib/auth.ts); input is validated before any DB access.
import ContactInfo from "@/models/ContactInfo";
import { makeAddHandler } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const POST = makeAddHandler(ContactInfo, "contact-info", { singleton: true, successMessage: "Contact info saved successfully" });

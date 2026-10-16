// Admin only: requires a valid session (see src/lib/auth.ts); input is validated before any DB access.
import Experience from "@/models/Experience";
import { makeDeleteHandler } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const DELETE = makeDeleteHandler(Experience, "experience", "Experience");
